'use strict';

module.exports = ( config ) => {
	config.set( {
		frameworks: [ 'qunit' ],
		files: [
			'node_modules/oojs/dist/oojs.min.js',
			'dist/treeDiffer-dist.js',
			'demo/DomTreeNode.js',
			'tests/*.js'
		],
		browsers: [ 'ChromeHeadless' ],
		singleRun: true,
		autoWatch: false
	} );
};
