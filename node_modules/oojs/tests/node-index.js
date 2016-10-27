/*jshint node:true */
var qunit = require( 'qunit' );

qunit.setup( {
	log: {
		summary: true,
		errors: true
	}
} );

qunit.run( {
	code: {
		path: './dist/oojs.js',
		namespace: 'OO'
	},
	tests: [
		'./tests/unit/core.test.js',
		'./tests/unit/util.test.js',
		'./tests/unit/EventEmitter.test.js',
		'./tests/unit/EmitterList.test.js',
		'./tests/unit/SortedEmitterList.test.js',
		'./tests/unit/Registry.test.js',
		'./tests/unit/Factory.test.js'
	]
}, function ( err, report ) {
	if ( err || report.failed ) {
		process.exit( 1 );
	}
} );
