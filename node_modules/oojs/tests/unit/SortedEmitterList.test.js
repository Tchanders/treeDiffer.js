( function ( oo ) {

	// Define a test list object using the oo.SortedEmitterList mixin
	function SortedTestList() {
		// Mixin constructor
		oo.EventEmitter.call( this );
		// Mixin constructor
		oo.SortedEmitterList.call(
			this,
			function ( a, b ) {
				return a.getContent() < b.getContent() ? -1 :
					(
						a.getContent() > b.getContent() ? 1 :
						0
					);
			}
		);
	}
	oo.mixinClass( SortedTestList, oo.EventEmitter );
	oo.mixinClass( SortedTestList, oo.SortedEmitterList );

	// Define a test item object
	function TestItem( content, id ) {
		// Mixin constructor
		oo.EventEmitter.call( this );

		this.content = content;
		this.id = id;
	}
	TestItem.prototype.equals = function ( other ) {
		return this.getContent() === other.getContent();
	};
	oo.mixinClass( TestItem, oo.EventEmitter );

	// Helper method to recognize items by their contents
	TestItem.prototype.getContent = function () {
		return this.content;
	};

	// Method to distinguish "equal" items
	TestItem.prototype.getIdentity = function () {
		return this.content + ( this.id ? this.id : '' );
	};

	// Helper method to get an array of item contents
	// for testing
	function getIdentityArray( arr ) {
		return arr.map( function ( item ) {
			return item.getIdentity();
		} );
	}

	QUnit.module( 'SortedEmitterList' );

	QUnit.test( 'addItems', function ( assert ) {
		var initialItems = [
				new TestItem( 'aa' ),
				new TestItem( 'bb' ),
				new TestItem( 'cc' )
			],
			cases = [
				{
					items: [
						initialItems[ 1 ], // bb
						initialItems[ 0 ], // aa
						initialItems[ 2 ] // cc
					],
					expected: [ 'aa', 'bb', 'cc' ],
					msg: 'Inserts items in sorted order.'
				},
				{
					items: initialItems,
					add: {
						items: [
							new TestItem( 'ba' ),
							new TestItem( 'ab' ),
							new TestItem( 'cd' ),
							new TestItem( 'bc' )
						]
					},
					expected: [ 'aa', 'ab', 'ba', 'bb', 'bc', 'cc', 'cd' ],
					msg: 'Inserts items into the correct places in an existing list'
				},
				{
					items: initialItems,
					add: {
						items: new TestItem( 'ab' )
					},
					expected: [ 'aa', 'ab', 'bb', 'cc' ],
					msg: 'Passing an item instead of an array to addItems'
				},
				{
					items:  initialItems,
					newSortingCallback: function ( a, b ) {
						// Flip the sort
						return a.getContent() > b.getContent() ? -1 :
							(
								a.getContent() < b.getContent() ? 1 :
								0
							);
					},
					add: {
						items: [
							new TestItem( 'ab' )
						]
					},
					// In this case we expect the entire list to be re-sorted
					// according to the new (flipped) sorting callback
					expected: [ 'cc', 'bb', 'ab', 'aa' ],
					msg: 'Flipping sort order and adding a new item'
				},
				{
					items: initialItems,
					add: {
						items: [
							new TestItem( 'bb', '2' )
						]
					},
					expected: [ 'aa', 'bb2', 'cc' ],
					msg: 'Adding duplicate replaces original item'
				}
			];

		cases.forEach( function ( test ) {
			var list = new SortedTestList();
			// Sort by content
			list.setSortingCallback( function ( a, b ) {
				return a.getContent() > b.getContent() ? 1 :
					(
						a.getContent() < b.getContent() ? -1 :
						0
					);
			} );

			list.addItems( test.items );

			if ( test.newSortingCallback ) {
				list.setSortingCallback( test.newSortingCallback );
			}

			if ( test.add ) {
				list.addItems( test.add.items, test.add.index );
			}

			assert.deepEqual( getIdentityArray( list.getItems() ), test.expected, test.msg );
		}, this );
	} );

	QUnit.test( 'Events', function ( assert ) {
		var result = [],
			list = new SortedTestList(),
			items = [
				new TestItem( 'aa' ),
				new TestItem( 'bb' ),
				new TestItem( 'cc' ),
				new TestItem( 'dd' )
			],
			stringifyEvent = function ( type, item, index ) {
				var result = type;
				if ( item ) {
					result += ':' + item.getIdentity();
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
		list.addItems( [ new TestItem( 'ca' ) ] );
		list.removeItems( items[ 2 ] );
		list.addItems( [
			new TestItem( 'ab' ),
			new TestItem( 'ba' ),
			new TestItem( 'bc' ),
			new TestItem( 'cd' )
		] );
		list.clearItems();
		// Add items out of sequence
		list.addItems( [
			new TestItem( 'dd' ),
			new TestItem( 'bb' ),
			new TestItem( 'aa' ),
			new TestItem( 'cc' )
		] );
		// Change the sorting callback to a flipped sort
		list.setSortingCallback( function ( a, b ) {
			return a.getContent() > b.getContent() ? -1 :
				(
					a.getContent() < b.getContent() ? 1 :
					0
				);
		} );
		list.items[ 1 ].content = 'ee';
		list.items[ 1 ].emit( 'sortChange' );

		assert.deepEqual( result, [
			// addItems
			'add:aa#0', // [ aa ]
			'add:bb#1', // [ aa, bb ]
			'add:cc#2', // [ aa, bb, cc ]
			'add:dd#3', // [ aa, bb, cc, dd ]
			// addItems
			'add:ca#2', // [ aa, bb, ca, cc, dd ]
			// removeItems
			'remove:cc#3', // [ aa, bb, ca, dd ]
			// addItems
			'add:ab#1', // [ aa, ab, bb, ca, dd ]
			'add:ba#2', // [ aa, ab, ba, bb, ca, dd ]
			'add:bc#4', // [ aa, ab, ba, bb, bc, ca, dd ]
			'add:cd#6', // [ aa, ab, ba, bb, bc, ca, cd, dd ]
			'clear',
			'add:dd#0', // [ dd ]
			'add:bb#0', // [ bb, dd]
			'add:aa#0', // [ aa, bb, dd]
			'add:cc#2', // [ aa, bb, cc, dd]
			// Changing the sorting callback
			'clear',
			'add:aa#0', // [ aa ]
			'add:bb#0', // [ bb, aa ]
			'add:cc#0', // [ cc, bb, aa ]
			'add:dd#0', // [ dd, cc, bb, aa ]
			'remove:ee#1', // [ dd, bb, aa ]
			'add:ee#0' // [ ee, dd, bb, aa ]
		], 'Events intercepted successfully.' );
	} );
}( OO ) );
