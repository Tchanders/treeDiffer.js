'use strict';

module.exports = function ( grunt ) {
	const wrapper = grunt.file.read( 'build/wrapper.js' ).split( '// @content' );

	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );
	grunt.loadNpmTasks( 'grunt-eslint' );
	grunt.loadNpmTasks( 'grunt-stylelint' );

	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),
		eslint: {
			options: {
				cache: true,
				fix: grunt.option( 'fix' )
			},
			all: '.'
		},
		stylelint: {
			all: '**/*.{css,less}'
		},
		clean: {
			dist: [ 'dist', 'demo/dist' ]
		},
		concat: {
			options: {
				sourceMap: true,
				banner: wrapper[ 0 ],
				footer: wrapper[ 1 ]
			},
			dist: {
				files: {
					'dist/treeDiffer-dist.js': [
						'src/treeDiffer.js',
						'src/treeDiffer.TreeNode.js',
						'src/treeDiffer.Tree.js',
						'src/treeDiffer.Differ.js',
						'build/export.js'
					]
				}
			}
		},
		copy: {
			dist: {
				files: {
					'demo/': 'dist/*',
					'demo/dist/oojs.min.js': 'node_modules/oojs/dist/oojs.min.js'
				}
			}
		}
	} );

	grunt.registerTask( 'build', [ 'clean', 'concat', 'copy' ] );
	grunt.registerTask( 'lint', [ 'eslint', 'stylelint' ] );
	grunt.registerTask( 'fix', 'eslint:fix' );
	grunt.registerTask( 'default', [ 'lint', 'build' ] );
};
