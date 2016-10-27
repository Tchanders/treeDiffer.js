( function ( oo ) {

	// Define a test list object using the oo.EmitterList mixin
	function TestList() {
		// Mixin constructor
		oo.EventEmitter.call( this );
		oo.EmitterList.call( this );
	}
	oo.mixinClass( TestList, oo.EventEmitter );
	oo.mixinClass( TestList, oo.EmitterList );

	// Define a test item object
	function TestItem( content ) {
		// Mixin constructor
		oo.EventEmitter.call( this );

		this.content = content;
	}
	oo.mixinClass( TestItem, oo.EventEmitter );

	// Helper method to recognize items by their contents
	TestItem.prototype.getContent = function () {
		return this.content;
	};

	// Helper method to get an array of item contents for testing
	function getContentArray( arr ) {
		return arr.map( function ( item ) {
			return item.getContent();
		} );
	}

	QUnit.module( 'EmitterList' );

	QUnit.test( 'addItems', function ( assert ) {
		var initialItems = [
				new TestItem( 'a' ),
				new TestItem( 'b' ),
				new TestItem( 'c' )
			],
			cases = [
				{
					items: initialItems,
					expected: [ 'a', 'b', 'c' ],
					msg: 'Inserting items in order'
				},
				{
					items: [],
					expected: [],
					msg: 'Inserting an empty array'
				},
				{
					items: [
						// 'a', 'b', 'c', 'a',
						initialItems[ 0 ],
						initialItems[ 1 ],
						initialItems[ 2 ],
						initialItems[ 0 ]
					],
					expected: [ 'b', 'c', 'a' ],
					msg: 'Moving duplicates when inserting a batch of items'
				},
				{
					items: initialItems,
					add: {
						items: [ initialItems[ 0 ] ],
						index: 2
					},
					expected: [ 'b', 'a', 'c' ],
					msg: 'Moving duplicates when re-inserting an item'
				},
				{
					items: initialItems,
					add: {
						items: [
							new TestItem( 'd' )
						]
					},
					expected: [ 'a', 'b', 'c', 'd' ],
					msg: 'Inserting an item without index defaults to the end'
				},
				{
					items: initialItems,
					add: {
						items: [
							new TestItem( 'd' )
						],
						index: 1
					},
					expected: [ 'a', 'd', 'b', 'c' ],
					msg: 'Inserting an item at a known index'
				},
				{
					items: initialItems,
					add: {
						items: [
							new TestItem( 'd' )
						],
						index: 5
					},
					expected: [ 'a', 'b', 'c', 'd' ],
					msg: 'Inserting an item at an invalid index'
				}
			];

		cases.forEach( function ( test ) {
			var list = new TestList();
			list.addItems( test.items );

			if ( test.add ) {
				list.addItems( test.add.items, test.add.index );
			}

			assert.deepEqual( getContentArray( list.getItems() ), test.expected, test.msg );
		} );
	} );

	QUnit.test( 'clearItems', function ( assert ) {
		var list = new TestList();

		list.addItems( [
			new TestItem( 'a' ),
			new TestItem( 'b' ),
			new TestItem( 'c' )
		] );
		assert.equal( list.getItemCount(), 3, 'Items added' );
		list.clearItems();
		assert.equal( list.getItemCount(), 0, 'Items cleared' );
		assert.ok( list.isEmpty(), 'List is empty' );
	} );

	QUnit.test( 'removeItems', function ( assert ) {
		var expected = [],
			list = new TestList(),
			items = [
				new TestItem( 'a' ),
				new TestItem( 'b' ),
				new TestItem( 'c' )
			];

		list.addItems( items );
		assert.equal( list.getItemCount(), 3, 'Items added' );

		list.removeItems( [ items[ 2 ] ] );
		assert.equal( list.getItemCount(), 2, 'Item removed' );
		assert.equal( list.getItemIndex( items[ 2 ] ), -1, 'The correct item was removed' );

		list.removeItems( [] );
		assert.equal( list.getItemCount(), 2, 'Removing empty array of items does nothing' );

		// Remove an item with aggregate events
		list.aggregate( { change: 'itemChange' } );
		list.on( 'itemChange', function ( item ) {
			expected.push( item.getContent() );
		} );

		list.removeItems( items[ 0 ] );
		// 'a' - Should not be intercepted
		items[ 0 ].emit( 'change' );
		// 'b'
		items[ 1 ].emit( 'change' );
		assert.deepEqual( expected, [ 'b' ], 'Removing an item also removes its aggregate events' );
	} );

	QUnit.test( 'aggregate', function ( assert ) {
		var item,
			list = new TestList(),
			expectChange = [],
			expectEdit = [],
			items = [
				new TestItem( 'a' ),
				new TestItem( 'b' ),
				new TestItem( 'c' )
			];

		list.addItems( items );

		list.aggregate( {
			change: 'itemChange',
			edit: 'itemEdit'
		} );
		list.on( 'itemChange', function ( item ) {
			expectChange.push( item.getContent() );
		} );
		list.on( 'itemEdit', function ( item ) {
			expectEdit.push( item.getContent() );
		} );

		// Change 'b'
		items[ 1 ].emit( 'change' );
		// Change 'a'
		items[ 0 ].emit( 'change' );
		// Edit 'c'
		items[ 2 ].emit( 'edit' );

		// Add an item after the fact
		item = new TestItem( 'd' );
		list.addItems( item );
		item.emit( 'change' );

		// Remove aggregate event
		list.aggregate( { edit: null } );

		// Retry events
		items[ 1 ].emit( 'change' );
		// 'a' - Edit should not be aggregated
		items[ 0 ].emit( 'edit' );

		// Check that we have the desired result
		assert.deepEqual( expectChange, [ 'b', 'a', 'd', 'b' ], 'Change event aggregation intercepted in the correct order' );
		assert.deepEqual( expectEdit, [ 'c' ], 'Edit event aggregation intercepted in the correct order' );

		// Verify that aggregating duplicate events throws an exception
		assert.throws( function () {
			list.aggregate( { change: 'itemChangeDuplicate' } );
		}, 'Duplicate event aggregation throws an error' );
	} );

	QUnit.test( 'Events', function ( assert ) {
		var result = [],
			list = new TestList(),
			items = [
				new TestItem( 'a' ),
				new TestItem( 'b' ),
				new TestItem( 'c' )
			],
			stringifyEvent = function ( type, item, index ) {
				var result = type;
				if ( item ) {
					result += ':' + item.getContent();
				}
				if ( index !== undefined ) {
					result += '#' + index;
				}
				return result;
			};

		// Register
		list.on( 'add', function ( item, index ) {
			result.push( stringifyEvent( 'add', item, index ) );
		} );
		list.on( 'move', function ( item, index ) {
			result.push( stringifyEvent( 'move', item, index ) );
		} );
		list.on( 'remove', function ( item, index ) {
			result.push( stringifyEvent( 'remove', item, index ) );
		} );
		list.on( 'clear', function () {
			result.push( stringifyEvent( 'clear' ) );
		} );

		// Trigger events
		list.addItems( items );
		// Move the item; Bad index on purpose
		list.addItems( [ items[ 0 ] ], 10 );
		list.removeItems( items[ 1 ] );
		// Nonexistent item
		list.removeItems( new TestItem( 'd' ) );
		list.clearItems();

		assert.deepEqual( result, [
			// addItems
			'add:a#0',
			'add:b#1',
			'add:c#2',
			// moveItems
			'move:a#2',
			// removeItems
			'remove:b#0',
			// clearItems
			'clear'
		], 'Correct events were emitted' );
	} );

}( OO ) );
