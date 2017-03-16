/* eslint-env node */
module.exports = function ( grunt ) {
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );
	grunt.loadNpmTasks( 'grunt-eslint' );
	grunt.loadNpmTasks( 'grunt-jsonlint' );

	grunt.initConfig( {
		eslint: {
			all: [
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
						'src/treeDiffer.js',
						'src/treeDiffer.TreeNode.js',
						'src/treeDiffer.Tree.js',
						'src/treeDiffer.Differ.js'
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
	grunt.registerTask( 'lint', [ 'eslint', 'jsonlint' ] );
	grunt.registerTask( 'fix', 'eslint:fix' );
	grunt.registerTask( 'default', [ 'lint', 'build' ] );
};
