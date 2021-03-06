'use strict';

module.exports = function ( grunt ) {
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );
	grunt.loadNpmTasks( 'grunt-eslint' );

	grunt.initConfig( {
		eslint: {
			options: {
				cache: true,
				fix: grunt.option( 'fix' )
			},
			all: [
				'**/*.{js,json}',
				'!node_modules/**',
				'!dist/**',
				'!demo/dist/**'
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
					'dist/oojs.min.js': 'node_modules/oojs/dist/oojs.min.js',
					'demo/': 'dist/*'
				}
			}
		}
	} );

	grunt.registerTask( 'build', [ 'concat', 'copy' ] );
	grunt.registerTask( 'lint', [ 'eslint' ] );
	grunt.registerTask( 'fix', 'eslint:fix' );
	grunt.registerTask( 'default', [ 'lint', 'build' ] );
};
