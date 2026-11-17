'use strict';

const { defineConfig, globalIgnores } = require( 'eslint/config' );
const wikimedia = require( 'eslint-config-wikimedia/flat' );

const getGlobals = ( ...names ) => Object.assign(
	{},
	...wikimedia( ...names ).map(
		( config ) => config.languageOptions && config.languageOptions.globals
	)
);
const commonGlobals = getGlobals( 'common' );
// Turn off the browser globals that the client config adds
const noBrowserGlobals = Object.fromEntries(
	Object.keys( getGlobals( 'client' ) )
		.filter( ( name ) => !Object.hasOwn( commonGlobals, name ) )
		.map( ( name ) => [ name, 'off' ] )
);

module.exports = defineConfig( [
	globalIgnores( [
		'dist/',
		'demo/dist/'
	] ),

	{
		extends: [ wikimedia( 'common' ) ]
	},
	{
		files: [
			'*.js',
			'build/**/*.js'
		],
		extends: [ wikimedia( 'server' ) ]
	},
	{
		files: [
			'build/**/*.js'
		],
		languageOptions: {
			globals: {
				treeDiffer: 'readonly'
			}
		}
	},
	{
		files: [
			'src/**/*.js'
		],
		extends: [ wikimedia( 'client' ) ],
		languageOptions: {
			globals: {
				...noBrowserGlobals,
				treeDiffer: 'writable'
			}
		},
		rules: {
			'max-len': 'off'
		}
	},
	{
		files: [
			'tests/**/*.js'
		],
		extends: [ wikimedia( 'client', 'qunit' ) ],
		languageOptions: {
			globals: {
				treeDiffer: 'readonly',
				OO: 'readonly'
			}
		},
		rules: {
			'no-implicit-globals': 'off'
		}
	},
	{
		files: [
			'demo/**/*.js'
		],
		extends: [ wikimedia( 'client' ) ],
		languageOptions: {
			globals: {
				treeDiffer: 'readonly',
				OO: 'readonly'
			}
		}
	}
] );
