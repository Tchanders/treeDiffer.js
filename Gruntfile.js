/* eslint-env node */
module.exports = function ( grunt ) {
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );
	grunt.loadNpmTasks( 'grunt-eslint' );
	grunt.loadNpmTasks( 'grunt-jsonlint' );

	grunt.initConfig( {
		eslint: {
			fix: {
				options: {
					fix: true
				},
				src: [
					'<%= eslint.main %>'
				]
			},
			main: [
				'**/*.js',
				'!node_modules/**',
				'!dist/**'
			]
		},
		jsonlint: {
			all: [
				'**/*.json',
				'!node_modules/**',
				'!dist/**'
			]
		},
		concat: {
			dist: {
				files: {
					'dist/treeDiffer-dist.js': [
						'treeDiffer.js',
						'treeDiffer.TreeNode.js',
						'treeDiffer.Tree.js',
						'treeDiffer.Differ.js'
					]
				}
			}
		},
		copy: {
			dist: {
				files: {
					'dist/oojs.min.js': 'node_modules/oojs/dist/oojs.min.js'
				}
			}
		}
	} );

	grunt.registerTask( 'build', [ 'concat', 'copy' ] );
	grunt.registerTask( 'lint', [ 'eslint:main', 'jsonlint' ] );
	grunt.registerTask( 'fix', 'eslint:fix' );
	grunt.registerTask( 'default', [ 'lint', 'build' ] );
};
