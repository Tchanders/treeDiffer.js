/*global hasOwn, toString */

/**
 * Assert whether a value is a plain object or not.
 *
 * @member OO
 * @param {Mixed} obj
 * @return {boolean}
 */
oo.isPlainObject = function ( obj ) {
	/*jshint eqnull:true, eqeqeq:false */

	// Any object or value whose internal [[Class]] property is not "[object Object]"
	// Support IE8: Explicitly filter out DOM nodes
	// Support IE8: Explicitly filter out Window object (needs loose comparison)
	if ( !obj || toString.call( obj ) !== '[object Object]' || obj.nodeType || ( obj != null && obj == obj.window ) ) {
		return false;
	}

	// The try/catch suppresses exceptions thrown when attempting to access
	// the "constructor" property of certain host objects such as Location
	// in Firefox < 20 (https://bugzilla.mozilla.org/814622)
	try {
		if ( obj.constructor &&
				!hasOwn.call( obj.constructor.prototype, 'isPrototypeOf' ) ) {
			return false;
		}
	} catch ( e ) {
		return false;
	}

	return true;
};
