/*global hasOwn */

( function () {

	/**
	 * @class OO.EventEmitter
	 *
	 * @constructor
	 */
	oo.EventEmitter = function OoEventEmitter() {
		// Properties

		/**
		 * Storage of bound event handlers by event name.
		 *
		 * @property
		 */
		this.bindings = {};
	};

	oo.initClass( oo.EventEmitter );

	/* Private helper functions */

	/**
	 * Validate a function or method call in a context
	 *
	 * For a method name, check that it names a function in the context object
	 *
	 * @private
	 * @param {Function|string} method Function or method name
	 * @param {Mixed} context The context of the call
	 * @throws {Error} A method name is given but there is no context
	 * @throws {Error} In the context object, no property exists with the given name
	 * @throws {Error} In the context object, the named property is not a function
	 */
	function validateMethod( method, context ) {
		// Validate method and context
		if ( typeof method === 'string' ) {
			// Validate method
			if ( context === undefined || context === null ) {
				throw new Error( 'Method name "' + method + '" has no context.' );
			}
			if ( typeof context[ method ] !== 'function' ) {
				// Technically the property could be replaced by a function before
				// call time. But this probably signals a typo.
				throw new Error( 'Property "' + method + '" is not a function' );
			}
		} else if ( typeof method !== 'function' ) {
			throw new Error( 'Invalid callback. Function or method name expected.' );
		}
	}

	/* Methods */

	/**
	 * Add a listener to events of a specific event.
	 *
	 * The listener can be a function or the string name of a method; if the latter, then the
	 * name lookup happens at the time the listener is called.
	 *
	 * @param {string} event Type of event to listen to
	 * @param {Function|string} method Function or method name to call when event occurs
	 * @param {Array} [args] Arguments to pass to listener, will be prepended to emitted arguments
	 * @param {Object} [context=null] Context object for function or method call
	 * @throws {Error} Listener argument is not a function or a valid method name
	 * @chainable
	 */
	oo.EventEmitter.prototype.on = function ( event, method, args, context ) {
		var bindings;

		validateMethod( method, context );

		if ( hasOwn.call( this.bindings, event ) ) {
			bindings = this.bindings[ event ];
		} else {
			// Auto-initialize bindings list
			bindings = this.bindings[ event ] = [];
		}
		// Add binding
		bindings.push( {
			method: method,
			args: args,
			context: ( arguments.length < 4 ) ? null : context
		} );
		return this;
	};

	/**
	 * Add a one-time listener to a specific event.
	 *
	 * @param {string} event Type of event to listen to
	 * @param {Function} listener Listener to call when event occurs
	 * @chainable
	 */
	oo.EventEmitter.prototype.once = function ( event, listener ) {
		var eventEmitter = this,
			wrapper = function () {
				eventEmitter.off( event, wrapper );
				return listener.apply( this, arguments );
			};
		return this.on( event, wrapper );
	};

	/**
	 * Remove a specific listener from a specific event.
	 *
	 * @param {string} event Type of event to remove listener from
	 * @param {Function|string} [method] Listener to remove. Must be in the same form as was passed
	 * to "on". Omit to remove all listeners.
	 * @param {Object} [context=null] Context object function or method call
	 * @chainable
	 * @throws {Error} Listener argument is not a function or a valid method name
	 */
	oo.EventEmitter.prototype.off = function ( event, method, context ) {
		var i, bindings;

		if ( arguments.length === 1 ) {
			// Remove all bindings for event
			delete this.bindings[ event ];
			return this;
		}

		validateMethod( method, context );

		if ( !hasOwn.call( this.bindings, event ) || !this.bindings[ event ].length ) {
			// No matching bindings
			return this;
		}

		// Default to null context
		if ( arguments.length < 3 ) {
			context = null;
		}

		// Remove matching handlers
		bindings = this.bindings[ event ];
		i = bindings.length;
		while ( i-- ) {
			if ( bindings[ i ].method === method && bindings[ i ].context === context ) {
				bindings.splice( i, 1 );
			}
		}

		// Cleanup if now empty
		if ( bindings.length === 0 ) {
			delete this.bindings[ event ];
		}
		return this;
	};

	/**
	 * Emit an event.
	 *
	 * @param {string} event Type of event
	 * @param {...Mixed} args First in a list of variadic arguments passed to event handler (optional)
	 * @return {boolean} Whether the event was handled by at least one listener
	 */
	oo.EventEmitter.prototype.emit = function ( event ) {
		var args = [],
			i, len, binding, bindings, method;

		if ( hasOwn.call( this.bindings, event ) ) {
			// Slicing ensures that we don't get tripped up by event handlers that add/remove bindings
			bindings = this.bindings[ event ].slice();
			for ( i = 1, len = arguments.length; i < len; i++ ) {
				args.push( arguments[ i ] );
			}
			for ( i = 0, len = bindings.length; i < len; i++ ) {
				binding = bindings[ i ];
				if ( typeof binding.method === 'string' ) {
					// Lookup method by name (late binding)
					method = binding.context[ binding.method ];
				} else {
					method = binding.method;
				}
				method.apply(
					binding.context,
					binding.args ? binding.args.concat( args ) : args
				);
			}
			return true;
		}
		return false;
	};

	/**
	 * Connect event handlers to an object.
	 *
	 * @param {Object} context Object to call methods on when events occur
	 * @param {Object.<string,string>|Object.<string,Function>|Object.<string,Array>} methods List of
	 *  event bindings keyed by event name containing either method names, functions or arrays containing
	 *  method name or function followed by a list of arguments to be passed to callback before emitted
	 *  arguments
	 * @chainable
	 */
	oo.EventEmitter.prototype.connect = function ( context, methods ) {
		var method, args, event;

		for ( event in methods ) {
			method = methods[ event ];
			// Allow providing additional args
			if ( Array.isArray( method ) ) {
				args = method.slice( 1 );
				method = method[ 0 ];
			} else {
				args = [];
			}
			// Add binding
			this.on( event, method, args, context );
		}
		return this;
	};

	/**
	 * Disconnect event handlers from an object.
	 *
	 * @param {Object} context Object to disconnect methods from
	 * @param {Object.<string,string>|Object.<string,Function>|Object.<string,Array>} [methods] List of
	 * event bindings keyed by event name. Values can be either method names or functions, but must be
	 * consistent with those used in the corresponding call to "connect".
	 * @chainable
	 */
	oo.EventEmitter.prototype.disconnect = function ( context, methods ) {
		var i, event, method, bindings;

		if ( methods ) {
			// Remove specific connections to the context
			for ( event in methods ) {
				method = methods[ event ];
				if ( Array.isArray( method ) ) {
					method = method[ 0 ];
				}
				this.off( event, method, context );
			}
		} else {
			// Remove all connections to the context
			for ( event in this.bindings ) {
				bindings = this.bindings[ event ];
				i = bindings.length;
				while ( i-- ) {
					// bindings[i] may have been removed by the previous step's
					// this.off so check it still exists
					if ( bindings[ i ] && bindings[ i ].context === context ) {
						this.off( event, bindings[ i ].method, context );
					}
				}
			}
		}

		return this;
	};

}() );
