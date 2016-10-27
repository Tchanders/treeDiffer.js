/*!
 * Grunt file
 *
 * ## Cross-browser unit testing
 *
 * To run tests in any other browser use: 'grunt watch' and then open http://localhost:9876/ in one
 * or more browsers. It automatically runs tests in all connected browsers on each grunt-watch event.
 *
 * To use the automated Sauce Labs setup (like on Jenkins), simply set SAUCE_USERNAME and
 * SAUCE_ACCESS_KEY from your bashrc and run 'grunt ci'. Sign up for free at https://saucelabs.com/signup/plan/free.
 */

/*jshint node:true */
module.exports = function ( grunt ) {
	var sauceBrowsers = require( './tests/saucelabs.browsers.js' );

	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-jscs' );
	grunt.loadNpmTasks( 'grunt-karma' );

	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),
		clean: {
			dist: 'dist/*'
		},
		concat: {
			oojs: {
				options: {
					banner: grunt.file.read( 'src/banner.txt' )
				},
				dest: 'dist/oojs.js',
				src: [
					'src/intro.js.txt',
					'src/core.js',
					'src/util.js',
					'src/EventEmitter.js',
					'src/EmitterList.js',
					'src/SortedEmitterList.js',
					'src/Registry.js',
					'src/Factory.js',
					'src/export.js',
					'src/outro.js.txt'
				]
			},
			jquery: {
				options: {
					banner: grunt.file.read( 'src/banner.jquery.txt' )
				},
				dest: 'dist/oojs.jquery.js',
				src: [
					'src/intro.js.txt',
					'src/core.js',
					'src/util/jquery.js',
					'src/EventEmitter.js',
					'src/EmitterList.js',
					'src/SortedEmitterList.js',
					'src/Registry.js',
					'src/Factory.js',
					'src/export.js',
					'src/outro.js.txt'
				]
			}
		},
		jshint: {
			options: {
				jshintrc: true
			},
			dev: [
				'*.js',
				'{src,tests}/**/*.js'
			],
			// Skipping the minimised distribution files
			dist: 'dist/**/oojs{.jquery,}.js'
		},
		jscs: {
			dev: '<%= jshint.dev %>'
		},
		uglify: {
			options: {
				banner: '/*! OOjs v<%= pkg.version %> | http://oojs.mit-license.org */',
				sourceMap: true,
				sourceMapIncludeSources: true,
				report: 'gzip'
			},
			js: {
				expand: true,
				src: 'dist/*.js',
				ext: '.min.js',
				extDot: 'last'
			}
		},
		karma: {
			options: {
				frameworks: [ 'qunit' ],
				files: [
					'lib/json2.js',
					'lib/es5-shim.js',
					'dist/oojs.js',
					'tests/testrunner.js',
					'tests/unit/*.js'
				],
				reporters: [ 'dots' ],
				singleRun: true,
				autoWatch: false,
				customLaunchers: sauceBrowsers,
				sauceLabs: {
					username: process.env.SAUCE_USERNAME || 'oojs',
					accessKey: process.env.SAUCE_ACCESS_KEY || '0e464279-3f2a-4ca0-9eb4-db220410bef0',
					recordScreenshots: false
				},
				captureTimeout: 90000
			},
			// Run sauce labs browsers in batches due lack of concurrency limit
			// (https://github.com/karma-runner/karma-sauce-launcher/issues/40)
			ci1: {
				browsers: [ 'slChrome', 'slFirefox', 'slIE11' ]
			},
			ci2: {
				browsers: [ 'slSafari6', 'slIE9', 'slIE6' ],
				// Support IE6: https://github.com/karma-runner/karma/issues/983
				transports: [ 'jsonp-polling' ]
			},
			// Primary unit test run (includes code coverage)
			main: {
				browsers: [ 'PhantomJS' ],
				preprocessors: {
					'dist/*.js': [ 'coverage' ]
				},
				reporters: [ 'dots', 'coverage' ],
				coverageReporter: { reporters: [
					{ type: 'html', dir: 'coverage/' },
					{ type: 'text-summary' }
				] }
			},
			jquery: {
				browsers: [ 'PhantomJS' ],
				options: {
					files: [
						'node_modules/jquery/dist/jquery.js',
						'dist/oojs.jquery.js',
						'tests/testrunner.js',
						'tests/unit/*.js'
					]
				}
			},
			other: {
				browsers: [ 'Chrome', 'Firefox' ]
			}
		},
		watch: {
			files: [
				'.{jscsrc,jshintignore,jshintrc}',
				'<%= jshint.dev %>'
			],
			tasks: '_test'
		}
	} );

	grunt.registerTask( 'git-build', function () {
		var done = this.async();
		require( 'child_process' ).exec( 'git rev-parse HEAD', function ( err, stout, stderr ) {
			if ( !stout || err || stderr ) {
				grunt.log.err( err || stderr );
				done( false );
				return;
			}
			grunt.config.set( 'pkg.version', grunt.config( 'pkg.version' ) + '-pre (' + stout.slice( 0, 10 ) + ')' );
			grunt.verbose.writeln( 'Added git HEAD to pgk.version' );
			done();
		} );
	} );

	grunt.registerTask( 'build', [ 'clean', 'concat', 'uglify' ] );
	grunt.registerTask( '_test', [ 'git-build', 'build', 'jshint', 'jscs', 'karma:main', 'karma:jquery', 'karma:other' ] );
	grunt.registerTask( 'ci', [ '_test', 'karma:ci1', 'karma:ci2' ] );

	if ( process.env.ZUUL_PIPELINE === 'gate-and-submit' ) {
		grunt.registerTask( 'test', 'ci' );
	} else {
		grunt.registerTask( 'test', '_test' );
	}

	grunt.registerTask( 'default', 'test' );
};
