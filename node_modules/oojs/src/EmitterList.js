( function () {

	/**
	 * Contain and manage a list of OO.EventEmitter items.
	 *
	 * Aggregates and manages their events collectively.
	 *
	 * This mixin must be used in a class that also mixes in OO.EventEmitter.
	 *
	 * @abstract
	 * @class OO.EmitterList
	 * @constructor
	 */
	oo.EmitterList = function OoEmitterList() {
		this.items = [];
		this.aggregateItemEvents = {};
	};

	/* Events */

	/**
	 * Item has been added
	 *
	 * @event add
	 * @param {OO.EventEmitter} item Added item
	 * @param {number} index Index items were added at
	 */

	/**
	 * Item has been moved to a new index
	 *
	 * @event move
	 * @param {OO.EventEmitter} item Moved item
	 * @param {number} index Index item was moved to
	 * @param {number} oldIndex The original index the item was in
	 */

	/**
	 * Item has been removed
	 *
	 * @event remove
	 * @param {OO.EventEmitter} item Removed item
	 * @param {number} index Index the item was removed from
	 */

	/**
	 * @event clear The list has been cleared of items
	 */

	/* Methods */

	/**
	 * Normalize requested index to fit into the bounds of the given array.
	 *
	 * @private
	 * @static
	 * @param {Array} arr Given array
	 * @param {number|undefined} index Requested index
	 * @return {number} Normalized index
	 */
	function normalizeArrayIndex( arr, index ) {
		return ( index === undefined || index < 0 || index >= arr.length ) ?
			arr.length :
			index;
	}

	/**
	 * Get all items.
	 *
	 * @return {OO.EventEmitter[]} Items in the list
	 */
	oo.EmitterList.prototype.getItems = function () {
		return this.items.slice( 0 );
	};

	/**
	 * Get the index of a specific item.
	 *
	 * @param {OO.EventEmitter} item Requested item
	 * @return {number} Index of the item
	 */
	oo.EmitterList.prototype.getItemIndex = function ( item ) {
		return this.items.indexOf( item );
	};

	/**
	 * Get number of items.
	 *
	 * @return {number} Number of items in the list
	 */
	oo.EmitterList.prototype.getItemCount = function () {
		return this.items.length;
	};

	/**
	 * Check if a list contains no items.
	 *
	 * @return {boolean} Group is empty
	 */
	oo.EmitterList.prototype.isEmpty = function () {
		return !this.items.length;
	};

	/**
	 * Aggregate the events emitted by the group.
	 *
	 * When events are aggregated, the group will listen to all contained items for the event,
	 * and then emit the event under a new name. The new event will contain an additional leading
	 * parameter containing the item that emitted the original event. Other arguments emitted from
	 * the original event are passed through.
	 *
	 * @param {Object.<string,string|null>} events An object keyed by the name of the event that should be
	 *  aggregated  (e.g., ‘click’) and the value of the new name to use (e.g., ‘groupClick’).
	 *  A `null` value will remove aggregated events.

	 * @throws {Error} If aggregation already exists
	 */
	oo.EmitterList.prototype.aggregate = function ( events ) {
		var i, item, add, remove, itemEvent, groupEvent;

		for ( itemEvent in events ) {
			groupEvent = events[ itemEvent ];

			// Remove existing aggregated event
			if ( Object.prototype.hasOwnProperty.call( this.aggregateItemEvents, itemEvent ) ) {
				// Don't allow duplicate aggregations
				if ( groupEvent ) {
					throw new Error( 'Duplicate item event aggregation for ' + itemEvent );
				}
				// Remove event aggregation from existing items
				for ( i = 0; i < this.items.length; i++ ) {
					item = this.items[ i ];
					if ( item.connect && item.disconnect ) {
						remove = {};
						remove[ itemEvent ] = [ 'emit', this.aggregateItemEvents[ itemEvent ], item ];
						item.disconnect( this, remove );
					}
				}
				// Prevent future items from aggregating event
				delete this.aggregateItemEvents[ itemEvent ];
			}

			// Add new aggregate event
			if ( groupEvent ) {
				// Make future items aggregate event
				this.aggregateItemEvents[ itemEvent ] = groupEvent;
				// Add event aggregation to existing items
				for ( i = 0; i < this.items.length; i++ ) {
					item = this.items[ i ];
					if ( item.connect && item.disconnect ) {
						add = {};
						add[ itemEvent ] = [ 'emit', groupEvent, item ];
						item.connect( this, add );
					}
				}
			}
		}
	};

	/**
	 * Add items to the list.
	 *
	 * @param {OO.EventEmitter|OO.EventEmitter[]} items Item to add or
	 *  an array of items to add
	 * @param {number} [index] Index to add items at. If no index is
	 *  given, or if the index that is given is invalid, the item
	 *  will be added at the end of the list.
	 * @chainable
	 * @fires add
	 * @fires move
	 */
	oo.EmitterList.prototype.addItems = function ( items, index ) {
		var i, oldIndex;

		if ( !Array.isArray( items ) ) {
			items = [ items ];
		}

		if ( items.length === 0 ) {
			return this;
		}

		index = normalizeArrayIndex( this.items, index );
		for ( i = 0; i < items.length; i++ ) {
			oldIndex = this.items.indexOf( items[ i ] );
			if ( oldIndex !== -1 ) {
				// Move item to new index
				index = this.moveItem( items[ i ], index );
				this.emit( 'move', items[ i ], index, oldIndex );
			} else {
				// insert item at index
				index = this.insertItem( items[ i ], index );
				this.emit( 'add', items[ i ], index );
			}
			index++;
		}

		return this;
	};

	/**
	 * Move an item from its current position to a new index.
	 *
	 * The item is expected to exist in the list. If it doesn't,
	 * the method will throw an exception.
	 *
	 * @private
	 * @param {OO.EventEmitter} item Items to add
	 * @param {number} newIndex Index to move the item to
	 * @return {number} The index the item was moved to
	 * @throws {Error} If item is not in the list
	 */
	oo.EmitterList.prototype.moveItem = function ( item, newIndex ) {
		var existingIndex = this.items.indexOf( item );

		if ( existingIndex === -1 ) {
			throw new Error( 'Item cannot be moved, because it is not in the list.' );
		}

		newIndex = normalizeArrayIndex( this.items, newIndex );

		// Remove the item from the current index
		this.items.splice( existingIndex, 1 );

		// Adjust new index after removal
		newIndex--;

		// Move the item to the new index
		this.items.splice( newIndex, 0, item );

		return newIndex;
	};

	/**
	 * Utility method to insert an item into the list, and
	 * connect it to aggregate events.
	 *
	 * Don't call this directly unless you know what you're doing.
	 * Use #addItems instead.
	 *
	 * @private
	 * @param {OO.EventEmitter} item Items to add
	 * @param {number} index Index to add items at
	 * @return {number} The index the item was added at
	 */
	oo.EmitterList.prototype.insertItem = function ( item, index ) {
		var events, event;

		// Add the item to event aggregation
		if ( item.connect && item.disconnect ) {
			events = {};
			for ( event in this.aggregateItemEvents ) {
				events[ event ] = [ 'emit', this.aggregateItemEvents[ event ], item ];
			}
			item.connect( this, events );
		}

		index = normalizeArrayIndex( this.items, index );

		// Insert into items array
		this.items.splice( index, 0, item );
		return index;
	};

	/**
	 * Remove items.
	 *
	 * @param {OO.EventEmitter[]} items Items to remove
	 * @chainable
	 * @fires remove
	 */
	oo.EmitterList.prototype.removeItems = function ( items ) {
		var i, item, index;

		if ( !Array.isArray( items ) ) {
			items = [ items ];
		}

		if ( items.length === 0 ) {
			return this;
		}

		// Remove specific items
		for ( i = 0; i < items.length; i++ ) {
			item = items[ i ];
			index = this.items.indexOf( item );
			if ( index !== -1 ) {
				if ( item.connect && item.disconnect ) {
					// Disconnect all listeners from the item
					item.disconnect( this );
				}
				this.items.splice( index, 1 );
				this.emit( 'remove', item, index );
			}
		}

		return this;
	};

	/**
	 * Clear all items
	 *
	 * @chainable
	 * @fires clear
	 */
	oo.EmitterList.prototype.clearItems = function () {
		var i, item,
			cleared = this.items.splice( 0, this.items.length );

		// Disconnect all items
		for ( i = 0; i < cleared.length; i++ ) {
			item = cleared[ i ];
			if ( item.connect && item.disconnect ) {
				item.disconnect( this );
			}
		}

		this.emit( 'clear' );

		return this;
	};

}() );
