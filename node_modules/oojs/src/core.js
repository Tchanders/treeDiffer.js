/*exported toString */
var
	/**
	 * Namespace for all classes, static methods and static properties.
	 * @class OO
	 * @singleton
	 */
	oo = {},
	// Optimisation: Local reference to Object.prototype.hasOwnProperty
	hasOwn = oo.hasOwnProperty,
	toString = oo.toString,
	// Object.create() is impossible to fully polyfill, so don't require it
	createObject = Object.create || ( function () {
		// Reusable constructor function
		function Empty() {}
		return function ( prototype, properties ) {
			var obj;
			Empty.prototype = prototype;
			obj = new Empty();
			if ( properties && hasOwn.call( properties, 'constructor' ) ) {
				obj.constructor = properties.constructor.value;
			}
			return obj;
		};
	} )();

/* Class Methods */

/**
 * Utility to initialize a class for OO inheritance.
 *
 * Currently this just initializes an empty static object.
 *
 * @param {Function} fn
 */
oo.initClass = function ( fn ) {
	fn.static = fn.static || {};
};

/**
 * Inherit from prototype to another using Object#create.
 *
 * Beware: This redefines the prototype, call before setting your prototypes.
 *
 * Beware: This redefines the prototype, can only be called once on a function.
 * If called multiple times on the same function, the previous prototype is lost.
 * This is how prototypal inheritance works, it can only be one straight chain
 * (just like classical inheritance in PHP for example). If you need to work with
 * multiple constructors consider storing an instance of the other constructor in a
 * property instead, or perhaps use a mixin (see OO.mixinClass).
 *
 *     function Thing() {}
 *     Thing.prototype.exists = function () {};
 *
 *     function Person() {
 *         Person.super.apply( this, arguments );
 *     }
 *     OO.inheritClass( Person, Thing );
 *     Person.static.defaultEyeCount = 2;
 *     Person.prototype.walk = function () {};
 *
 *     function Jumper() {
 *         Jumper.super.apply( this, arguments );
 *     }
 *     OO.inheritClass( Jumper, Person );
 *     Jumper.prototype.jump = function () {};
 *
 *     Jumper.static.defaultEyeCount === 2;
 *     var x = new Jumper();
 *     x.jump();
 *     x.walk();
 *     x instanceof Thing && x instanceof Person && x instanceof Jumper;
 *
 * @param {Function} targetFn
 * @param {Function} originFn
 * @throws {Error} If target already inherits from origin
 */
oo.inheritClass = function ( targetFn, originFn ) {
	var targetConstructor;

	if ( targetFn.prototype instanceof originFn ) {
		throw new Error( 'Target already inherits from origin' );
	}

	targetConstructor = targetFn.prototype.constructor;

	// Using ['super'] instead of .super because 'super' is not supported
	// by IE 8 and below (bug 63303).
	// Provide .parent as alias for code supporting older browsers which
	// allows people to comply with their style guide.
	targetFn[ 'super' ] = targetFn.parent = originFn;

	targetFn.prototype = createObject( originFn.prototype, {
		// Restore constructor property of targetFn
		constructor: {
			value: targetConstructor,
			enumerable: false,
			writable: true,
			configurable: true
		}
	} );

	// Extend static properties - always initialize both sides
	oo.initClass( originFn );
	targetFn.static = createObject( originFn.static );
};

/**
 * Copy over *own* prototype properties of a mixin.
 *
 * The 'constructor' (whether implicit or explicit) is not copied over.
 *
 * This does not create inheritance to the origin. If you need inheritance,
 * use OO.inheritClass instead.
 *
 * Beware: This can redefine a prototype property, call before setting your prototypes.
 *
 * Beware: Don't call before OO.inheritClass.
 *
 *     function Foo() {}
 *     function Context() {}
 *
 *     // Avoid repeating this code
 *     function ContextLazyLoad() {}
 *     ContextLazyLoad.prototype.getContext = function () {
 *         if ( !this.context ) {
 *             this.context = new Context();
 *         }
 *         return this.context;
 *     };
 *
 *     function FooBar() {}
 *     OO.inheritClass( FooBar, Foo );
 *     OO.mixinClass( FooBar, ContextLazyLoad );
 *
 * @param {Function} targetFn
 * @param {Function} originFn
 */
oo.mixinClass = function ( targetFn, originFn ) {
	var key;

	// Copy prototype properties
	for ( key in originFn.prototype ) {
		if ( key !== 'constructor' && hasOwn.call( originFn.prototype, key ) ) {
			targetFn.prototype[ key ] = originFn.prototype[ key ];
		}
	}

	// Copy static properties - always initialize both sides
	oo.initClass( targetFn );
	if ( originFn.static ) {
		for ( key in originFn.static ) {
			if ( hasOwn.call( originFn.static, key ) ) {
				targetFn.static[ key ] = originFn.static[ key ];
			}
		}
	} else {
		oo.initClass( originFn );
	}
};

/* Object Methods */

/**
 * Get a deeply nested property of an object using variadic arguments, protecting against
 * undefined property errors.
 *
 * `quux = oo.getProp( obj, 'foo', 'bar', 'baz' );` is equivalent to `quux = obj.foo.bar.baz;`
 * except that the former protects against JS errors if one of the intermediate properties
 * is undefined. Instead of throwing an error, this function will return undefined in
 * that case.
 *
 * @param {Object} obj
 * @param {...Mixed} [keys]
 * @return {Object|undefined} obj[arguments[1]][arguments[2]].... or undefined
 */
oo.getProp = function ( obj ) {
	var i,
		retval = obj;
	for ( i = 1; i < arguments.length; i++ ) {
		if ( retval === undefined || retval === null ) {
			// Trying to access a property of undefined or null causes an error
			return undefined;
		}
		retval = retval[ arguments[ i ] ];
	}
	return retval;
};

/**
 * Set a deeply nested property of an object using variadic arguments, protecting against
 * undefined property errors.
 *
 * `oo.setProp( obj, 'foo', 'bar', 'baz' );` is equivalent to `obj.foo.bar = baz;` except that
 * the former protects against JS errors if one of the intermediate properties is
 * undefined. Instead of throwing an error, undefined intermediate properties will be
 * initialized to an empty object. If an intermediate property is not an object, or if obj itself
 * is not an object, this function will silently abort.
 *
 * @param {Object} obj
 * @param {...Mixed} [keys]
 * @param {Mixed} [value]
 */
oo.setProp = function ( obj ) {
	var i,
		prop = obj;
	if ( Object( obj ) !== obj ) {
		return;
	}
	for ( i = 1; i < arguments.length - 2; i++ ) {
		if ( prop[ arguments[ i ] ] === undefined ) {
			prop[ arguments[ i ] ] = {};
		}
		if ( Object( prop[ arguments[ i ] ] ) !== prop[ arguments[ i ] ] ) {
			return;
		}
		prop = prop[ arguments[ i ] ];
	}
	prop[ arguments[ arguments.length - 2 ] ] = arguments[ arguments.length - 1 ];
};

/**
 * Create a new object that is an instance of the same
 * constructor as the input, inherits from the same object
 * and contains the same own properties.
 *
 * This makes a shallow non-recursive copy of own properties.
 * To create a recursive copy of plain objects, use #copy.
 *
 *     var foo = new Person( mom, dad );
 *     foo.setAge( 21 );
 *     var foo2 = OO.cloneObject( foo );
 *     foo.setAge( 22 );
 *
 *     // Then
 *     foo2 !== foo; // true
 *     foo2 instanceof Person; // true
 *     foo2.getAge(); // 21
 *     foo.getAge(); // 22
 *
 * @param {Object} origin
 * @return {Object} Clone of origin
 */
oo.cloneObject = function ( origin ) {
	var key, r;

	r = createObject( origin.constructor.prototype );

	for ( key in origin ) {
		if ( hasOwn.call( origin, key ) ) {
			r[ key ] = origin[ key ];
		}
	}

	return r;
};

/**
 * Get an array of all property values in an object.
 *
 * @param {Object} obj Object to get values from
 * @return {Array} List of object values
 */
oo.getObjectValues = function ( obj ) {
	var key, values;

	if ( obj !== Object( obj ) ) {
		throw new TypeError( 'Called on non-object' );
	}

	values = [];
	for ( key in obj ) {
		if ( hasOwn.call( obj, key ) ) {
			values[ values.length ] = obj[ key ];
		}
	}

	return values;
};

/**
 * Use binary search to locate an element in a sorted array.
 *
 * searchFunc is given an element from the array. `searchFunc(elem)` must return a number
 * above 0 if the element we're searching for is to the right of (has a higher index than) elem,
 * below 0 if it is to the left of elem, or zero if it's equal to elem.
 *
 * To search for a specific value with a comparator function (a `function cmp(a,b)` that returns
 * above 0 if `a > b`, below 0 if `a < b`, and 0 if `a == b`), you can use
 * `searchFunc = cmp.bind( null, value )`.
 *
 * @param {Array} arr Array to search in
 * @param {Function} searchFunc Search function
 * @param {boolean} [forInsertion] If not found, return index where val could be inserted
 * @return {number|null} Index where val was found, or null if not found
 */
oo.binarySearch = function ( arr, searchFunc, forInsertion ) {
	var mid, cmpResult,
		left = 0,
		right = arr.length;
	while ( left < right ) {
		// Equivalent to Math.floor( ( left + right ) / 2 ) but much faster
		/*jshint bitwise:false */
		mid = ( left + right ) >> 1;
		cmpResult = searchFunc( arr[ mid ] );
		if ( cmpResult < 0 ) {
			right = mid;
		} else if ( cmpResult > 0 ) {
			left = mid + 1;
		} else {
			return mid;
		}
	}
	return forInsertion ? right : null;
};

/**
 * Recursively compare properties between two objects.
 *
 * A false result may be caused by property inequality or by properties in one object missing from
 * the other. An asymmetrical test may also be performed, which checks only that properties in the
 * first object are present in the second object, but not the inverse.
 *
 * If either a or b is null or undefined it will be treated as an empty object.
 *
 * @param {Object|undefined|null} a First object to compare
 * @param {Object|undefined|null} b Second object to compare
 * @param {boolean} [asymmetrical] Whether to check only that a's values are equal to b's
 *  (i.e. a is a subset of b)
 * @return {boolean} If the objects contain the same values as each other
 */
oo.compare = function ( a, b, asymmetrical ) {
	var aValue, bValue, aType, bType, k;

	if ( a === b ) {
		return true;
	}

	a = a || {};
	b = b || {};

	if ( typeof a.nodeType === 'number' && typeof a.isEqualNode === 'function' ) {
		return a.isEqualNode( b );
	}

	for ( k in a ) {
		if ( !hasOwn.call( a, k ) || a[ k ] === undefined || a[ k ] === b[ k ] ) {
			// Support es3-shim: Without the hasOwn filter, comparing [] to {} will be false in ES3
			// because the shimmed "forEach" is enumerable and shows up in Array but not Object.
			// Also ignore undefined values, because there is no conceptual difference between
			// a key that is absent and a key that is present but whose value is undefined.
			continue;
		}

		aValue = a[ k ];
		bValue = b[ k ];
		aType = typeof aValue;
		bType = typeof bValue;
		if ( aType !== bType ||
			(
				( aType === 'string' || aType === 'number' || aType === 'boolean' ) &&
				aValue !== bValue
			) ||
			( aValue === Object( aValue ) && !oo.compare( aValue, bValue, true ) ) ) {
			return false;
		}
	}
	// If the check is not asymmetrical, recursing with the arguments swapped will verify our result
	return asymmetrical ? true : oo.compare( b, a, true );
};

/**
 * Create a plain deep copy of any kind of object.
 *
 * Copies are deep, and will either be an object or an array depending on `source`.
 *
 * @param {Object} source Object to copy
 * @param {Function} [leafCallback] Applied to leaf values after they are cloned but before they are added to the clone
 * @param {Function} [nodeCallback] Applied to all values before they are cloned.  If the nodeCallback returns a value other than undefined, the returned value is used instead of attempting to clone.
 * @return {Object} Copy of source object
 */
oo.copy = function ( source, leafCallback, nodeCallback ) {
	var key, destination;

	if ( nodeCallback ) {
		// Extensibility: check before attempting to clone source.
		destination = nodeCallback( source );
		if ( destination !== undefined ) {
			return destination;
		}
	}

	if ( Array.isArray( source ) ) {
		// Array (fall through)
		destination = new Array( source.length );
	} else if ( source && typeof source.clone === 'function' ) {
		// Duck type object with custom clone method
		return leafCallback ? leafCallback( source.clone() ) : source.clone();
	} else if ( source && typeof source.cloneNode === 'function' ) {
		// DOM Node
		return leafCallback ?
			leafCallback( source.cloneNode( true ) ) :
			source.cloneNode( true );
	} else if ( oo.isPlainObject( source ) ) {
		// Plain objects (fall through)
		destination = {};
	} else {
		// Non-plain objects (incl. functions) and primitive values
		return leafCallback ? leafCallback( source ) : source;
	}

	// source is an array or a plain object
	for ( key in source ) {
		destination[ key ] = oo.copy( source[ key ], leafCallback, nodeCallback );
	}

	// This is an internal node, so we don't apply the leafCallback.
	return destination;
};

/**
 * Generate a hash of an object based on its name and data.
 *
 * Performance optimization: <http://jsperf.com/ve-gethash-201208#/toJson_fnReplacerIfAoForElse>
 *
 * To avoid two objects with the same values generating different hashes, we utilize the replacer
 * argument of JSON.stringify and sort the object by key as it's being serialized. This may or may
 * not be the fastest way to do this; we should investigate this further.
 *
 * Objects and arrays are hashed recursively. When hashing an object that has a .getHash()
 * function, we call that function and use its return value rather than hashing the object
 * ourselves. This allows classes to define custom hashing.
 *
 * @param {Object} val Object to generate hash for
 * @return {string} Hash of object
 */
oo.getHash = function ( val ) {
	return JSON.stringify( val, oo.getHash.keySortReplacer );
};

/**
 * Sort objects by key (helper function for OO.getHash).
 *
 * This is a callback passed into JSON.stringify.
 *
 * @method getHash_keySortReplacer
 * @param {string} key Property name of value being replaced
 * @param {Mixed} val Property value to replace
 * @return {Mixed} Replacement value
 */
oo.getHash.keySortReplacer = function ( key, val ) {
	var normalized, keys, i, len;
	if ( val && typeof val.getHashObject === 'function' ) {
		// This object has its own custom hash function, use it
		val = val.getHashObject();
	}
	if ( !Array.isArray( val ) && Object( val ) === val ) {
		// Only normalize objects when the key-order is ambiguous
		// (e.g. any object not an array).
		normalized = {};
		keys = Object.keys( val ).sort();
		i = 0;
		len = keys.length;
		for ( ; i < len; i += 1 ) {
			normalized[ keys[ i ] ] = val[ keys[ i ] ];
		}
		return normalized;

	// Primitive values and arrays get stable hashes
	// by default. Lets those be stringified as-is.
	} else {
		return val;
	}
};

/**
 * Get the unique values of an array, removing duplicates
 *
 * @param {Array} arr Array
 * @return {Array} Unique values in array
 */
oo.unique = function ( arr ) {
	return arr.reduce( function ( result, current ) {
		if ( result.indexOf( current ) === -1 ) {
			result.push( current );
		}
		return result;
	}, [] );
};

/**
 * Compute the union (duplicate-free merge) of a set of arrays.
 *
 * Arrays values must be convertable to object keys (strings).
 *
 * By building an object (with the values for keys) in parallel with
 * the array, a new item's existence in the union can be computed faster.
 *
 * @param {...Array} arrays Arrays to union
 * @return {Array} Union of the arrays
 */
oo.simpleArrayUnion = function () {
	var i, ilen, arr, j, jlen,
		obj = {},
		result = [];

	for ( i = 0, ilen = arguments.length; i < ilen; i++ ) {
		arr = arguments[ i ];
		for ( j = 0, jlen = arr.length; j < jlen; j++ ) {
			if ( !obj[ arr[ j ] ] ) {
				obj[ arr[ j ] ] = true;
				result.push( arr[ j ] );
			}
		}
	}

	return result;
};

/**
 * Combine arrays (intersection or difference).
 *
 * An intersection checks the item exists in 'b' while difference checks it doesn't.
 *
 * Arrays values must be convertable to object keys (strings).
 *
 * By building an object (with the values for keys) of 'b' we can
 * compute the result faster.
 *
 * @private
 * @param {Array} a First array
 * @param {Array} b Second array
 * @param {boolean} includeB Whether to items in 'b'
 * @return {Array} Combination (intersection or difference) of arrays
 */
function simpleArrayCombine( a, b, includeB ) {
	var i, ilen, isInB,
		bObj = {},
		result = [];

	for ( i = 0, ilen = b.length; i < ilen; i++ ) {
		bObj[ b[ i ] ] = true;
	}

	for ( i = 0, ilen = a.length; i < ilen; i++ ) {
		isInB = !!bObj[ a[ i ] ];
		if ( isInB === includeB ) {
			result.push( a[ i ] );
		}
	}

	return result;
}

/**
 * Compute the intersection of two arrays (items in both arrays).
 *
 * Arrays values must be convertable to object keys (strings).
 *
 * @param {Array} a First array
 * @param {Array} b Second array
 * @return {Array} Intersection of arrays
 */
oo.simpleArrayIntersection = function ( a, b ) {
	return simpleArrayCombine( a, b, true );
};

/**
 * Compute the difference of two arrays (items in 'a' but not 'b').
 *
 * Arrays values must be convertable to object keys (strings).
 *
 * @param {Array} a First array
 * @param {Array} b Second array
 * @return {Array} Intersection of arrays
 */
oo.simpleArrayDifference = function ( a, b ) {
	return simpleArrayCombine( a, b, false );
};
