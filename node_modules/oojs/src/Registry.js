/*global hasOwn */

/**
 * @class OO.Registry
 * @mixins OO.EventEmitter
 *
 * @constructor
 */
oo.Registry = function OoRegistry() {
	// Mixin constructors
	oo.EventEmitter.call( this );

	// Properties
	this.registry = {};
};

/* Inheritance */

oo.mixinClass( oo.Registry, oo.EventEmitter );

/* Events */

/**
 * @event register
 * @param {string} name
 * @param {Mixed} data
 */

/**
 * @event unregister
 * @param {string} name
 * @param {Mixed} data Data removed from registry
 */

/* Methods */

/**
 * Associate one or more symbolic names with some data.
 *
 * Any existing entry with the same name will be overridden.
 *
 * @param {string|string[]} name Symbolic name or list of symbolic names
 * @param {Mixed} data Data to associate with symbolic name
 * @fires register
 * @throws {Error} Name argument must be a string or array
 */
oo.Registry.prototype.register = function ( name, data ) {
	var i, len;
	if ( typeof name === 'string' ) {
		this.registry[ name ] = data;
		this.emit( 'register', name, data );
	} else if ( Array.isArray( name ) ) {
		for ( i = 0, len = name.length; i < len; i++ ) {
			this.register( name[ i ], data );
		}
	} else {
		throw new Error( 'Name must be a string or array, cannot be a ' + typeof name );
	}
};

/**
 * Remove one or more symbolic names from the registry
 *
 * @param {string|string[]} name Symbolic name or list of symbolic names
 * @fires unregister
 * @throws {Error} Name argument must be a string or array
 */
oo.Registry.prototype.unregister = function ( name ) {
	var i, len, data;
	if ( typeof name === 'string' ) {
		data = this.lookup( name );
		if ( data !== undefined ) {
			delete this.registry[ name ];
			this.emit( 'unregister', name, data );
		}
	} else if ( Array.isArray( name ) ) {
		for ( i = 0, len = name.length; i < len; i++ ) {
			this.unregister( name[ i ] );
		}
	} else {
		throw new Error( 'Name must be a string or array, cannot be a ' + typeof name );
	}
};

/**
 * Get data for a given symbolic name.
 *
 * @param {string} name Symbolic name
 * @return {Mixed|undefined} Data associated with symbolic name
 */
oo.Registry.prototype.lookup = function ( name ) {
	if ( hasOwn.call( this.registry, name ) ) {
		return this.registry[ name ];
	}
};
