/*!
 * treeDiffer.Differ
 *
 * Released under the MIT license
 */

/* eslint-disable dot-notation */
// We use [ 'null' ] as an index, but for consistencty with
// variable indicies [ i ][ j ] we prefer not to use dot notation

/**
 * Differ
 *
 * Find the minimum transactions to get from the first tree to the second tree. Each
 * transaction is of the form [nodeToRemove, nodeToInsert], where nodeToRemove or
 * nodeToInsert (but not both) can be null. The tree diffing algorithm is presented in:
 * http://epubs.siam.org/doi/abs/10.1137/0218082?journalCode=smjcat
 *
 * @class
 * @constructor
 * @param {treeDiffer.Tree} tree1 First tree
 * @param {treeDiffer.Tree} tree2 Second tree
 * @param {number} [timeout=1000] Timeout after which to stop diffing
 */
treeDiffer.Differ = function ( tree1, tree2, timeout ) {

	this.endTime = Date.now() + ( timeout || 1000 );

	this.tree1 = tree1;
	this.tree2 = tree2;

	this.insertCost = 1;
	this.removeCost = 1;
	this.changeCost = 1;

	// Temporary, changing store of transactions
	const transactions = {
		null: {
			null: []
		}
	};

	// Permanent store of transactions such that transactions[x][y] is the minimum
	// transactions to get from the sub-tree rooted at node x (in tree1) to the sub-tree
	// rooted at node y (in tree2).
	this.transactions = {
		null: {}
	};

	// All possible transactions
	this.indexToTransaction = [];
	this.indexToTransaction.push( [ null, null ] );

	let transactionIndex = 0;
	// Indices for each transaction, to avoid high performance cost of creating the
	// transactions multiple times
	this.transactionToIndex = {
		null: {
			null: 0
		}
	};
	transactionIndex += 1;

	// Populate transaction stores
	for ( let i = 0, ilen = this.tree1.orderedNodes.length; i < ilen; i++ ) {

		transactions[ i ] = {
			null: []
		};
		this.transactionToIndex[ i ] = {
			null: transactionIndex
		};
		transactionIndex += 1;
		this.indexToTransaction.push( [ i, null ] );

		for ( let j = 0, jlen = this.tree2.orderedNodes.length; j < jlen; j++ ) {
			transactions[ null ][ j ] = [];
			transactions[ i ][ j ] = [];

			this.transactionToIndex[ null ][ j ] = transactionIndex;
			transactionIndex += 1;
			this.indexToTransaction.push( [ null, j ] );

			this.transactionToIndex[ i ][ j ] = transactionIndex;
			transactionIndex += 1;
			this.indexToTransaction.push( [ i, j ] );
		}

		this.transactions[ i ] = {};

	}

	this.populateTransactions( transactions );
};

/**
 * Populate this.transactions with minimum transactions between all possible trees
 *
 * @param {Object} transactions Temporary store of transactions between trees
 */
treeDiffer.Differ.prototype.populateTransactions = function ( transactions ) {
	const differ = this;

	function getTransactionFromIndex( index ) {
		return differ.indexToTransaction[ index ];
	}

	for ( let i = 0, ilen = this.tree1.keyRoots.length; i < ilen; i++ ) {

		// Make transactions for tree -> null
		const keyRoot1 = this.tree1.orderedNodes[ this.tree1.keyRoots[ i ] ];
		const iNulls = [];
		for ( let ii = keyRoot1.leftmost; ii < keyRoot1.index + 1; ii++ ) {
			iNulls.push( this.transactionToIndex[ ii ][ null ] );
			transactions[ ii ][ null ] = iNulls.slice();
		}

		for ( let j = 0, jlen = this.tree2.keyRoots.length; j < jlen; j++ ) {

			// Make transactions of null -> tree
			const keyRoot2 = this.tree2.orderedNodes[ this.tree2.keyRoots[ j ] ];
			const jNulls = [];
			for ( let jj = keyRoot2.leftmost; jj < keyRoot2.index + 1; jj++ ) {
				jNulls.push( this.transactionToIndex[ null ][ jj ] );
				transactions[ null ][ jj ] = jNulls.slice();
			}

			// Get the diff
			this.findMinimumTransactions( keyRoot1, keyRoot2, transactions );

			if ( Date.now() > this.endTime ) {
				this.transactions = null;
				return;
			}
		}
	}

	for ( let i = 0, ilen = this.tree1.orderedNodes.length; i < ilen; i++ ) {
		for ( let j = 0, jlen = this.tree2.orderedNodes.length; j < jlen; j++ ) {
			if ( this.transactions[ i ][ j ] && this.transactions[ i ][ j ].length > 0 ) {
				this.transactions[ i ][ j ] = this.transactions[ i ][ j ].map( getTransactionFromIndex );
			}
		}
	}

};

/**
 * Get the cost of removing a node from the first tree, inserting a node into the second
 * tree, or relabelling a node from the first tree to a node from the second tree.
 *
 * @param {treeDiffer.TreeNode} node1 Node from the first tree
 * @param {treeDiffer.TreeNode} node2 Node from the second tree]
 * @return {number} Cost of the transaction
 */
treeDiffer.Differ.prototype.getNodeDistance = function ( node1, node2 ) {
	if ( node1 === null && node2 === null ) {
		return 0;
	}
	if ( node1 === null ) {
		return this.insertCost;
	}
	if ( node2 === null ) {
		return this.removeCost;
	}
	if ( node1.isEqual( node2 ) ) {
		return 0;
	}
	return this.changeCost;
};

/**
 * Find the minimum transactions to get from the first tree to the second tree. This
 * method is the heart of the tree differ.
 *
 * @param {treeDiffer.TreeNode} keyRoot1 A keyroot from the first tree
 * @param {treeDiffer.TreeNode} keyRoot2 A keyroot from the second tree
 * @param {Object} transactions Temporary store of transactions between trees
 */
treeDiffer.Differ.prototype.findMinimumTransactions = function ( keyRoot1, keyRoot2, transactions ) {
	function getLowestCost( removeCost, insertCost, changeCost ) {
		// This used to be written as:
		//  transaction = costs.indexOf( Math.min.apply( null, costs ) )
		// but expanding into two simple comparisons makes it much faster.
		let minCost = removeCost,
			index = 0;
		if ( insertCost < minCost ) {
			index = 1;
			minCost = insertCost;
		}
		if ( changeCost < minCost ) {
			index = 2;
		}
		return index;
	}

	for ( let i = keyRoot1.leftmost; i < keyRoot1.index + 1; i++ ) {
		const iMinus1 = i === keyRoot1.leftmost ? null : i - 1;
		const orderedNode1 = this.tree1.orderedNodes[ i ];

		for ( let j = keyRoot2.leftmost; j < keyRoot2.index + 1; j++ ) {
			const jMinus1 = j === keyRoot2.leftmost ? null : j - 1;
			const orderedNode2 = this.tree2.orderedNodes[ j ];

			if ( orderedNode1.leftmost === keyRoot1.leftmost && orderedNode2.leftmost === keyRoot2.leftmost ) {

				// Previous transactions, leading up to a remove, insert or change
				const remove = transactions[ iMinus1 ][ j ];
				const insert = transactions[ i ][ jMinus1 ];
				const change = transactions[ iMinus1 ][ jMinus1 ];

				const nodeDistance = this.getNodeDistance( orderedNode1, orderedNode2 );

				// Cost of each transaction
				const transaction = getLowestCost(
					remove.length + this.removeCost,
					insert.length + this.insertCost,
					change.length + nodeDistance
				);

				if ( transaction === 0 ) {
					// Record a remove
					( transactions[ i ][ j ] = remove.slice() ).push(
						this.transactionToIndex[ i ][ null ]
					);
				} else if ( transaction === 1 ) {
					// Record an insert
					( transactions[ i ][ j ] = insert.slice() ).push(
						this.transactionToIndex[ null ][ j ]
					);
				} else {
					transactions[ i ][ j ] = change.slice();
					// If nodes i and j are different, record a change,
					// otherwise there is no transaction
					if ( nodeDistance === 1 ) {
						transactions[ i ][ j ].push( this.transactionToIndex[ i ][ j ] );
					}
				}

				// No need to do a shallow copy here as transactions[ i ][ j ] and
				// this.transactions[ i ][ j ] will never be changed again after this line.
				this.transactions[ i ][ j ] = transactions[ i ][ j ];
			} else {

				// Previous transactions, leading up to a remove, insert or change
				const remove = transactions[ iMinus1 ][ j ];
				const insert = transactions[ i ][ jMinus1 ];
				const change = transactions[
					orderedNode1.leftmost - 1 < keyRoot1.leftmost ? null : orderedNode1.leftmost - 1
				][
					orderedNode2.leftmost - 1 < keyRoot2.leftmost ? null : orderedNode2.leftmost - 1
				];

				const transaction = getLowestCost(
					remove.length + this.removeCost,
					insert.length + this.insertCost,
					change.length + this.transactions[ i ][ j ].length
				);
				if ( transaction === 0 ) {
					// Record a remove
					( transactions[ i ][ j ] = remove.slice() ).push(
						this.transactionToIndex[ i ][ null ]
					);
				} else if ( transaction === 1 ) {
					// Record an insert
					( transactions[ i ][ j ] = insert.slice() ).push(
						this.transactionToIndex[ null ][ j ]
					);
				} else {
					// Record a change
					transactions[ i ][ j ] = change.concat( this.transactions[ i ][ j ] );
				}

			}

		}

	}
};

/**
 * Given a set of transactions and the lengths of two trees, find the nodes that
 * correspond.
 *
 * @param {Array} transactions Minimum transactions to get from the first tree to the
 * second tree
 * @param {number} oldTreeLength Number of nodes in the first tree
 * @param {number} newTreeLength Number of nodes in the second tree
 * @return {Object} Corresponding nodes
 */
treeDiffer.Differ.prototype.getCorrespondingNodes = function ( transactions, oldTreeLength, newTreeLength ) {
	const oldToNew = {},
		newToOld = {},
		remove = [],
		insert = [],
		change = {},
		ilen = Math.max( oldTreeLength, newTreeLength ),
		jlen = ilen;

	for ( let i = 0; i < transactions.length; i++ ) {
		if ( transactions[ i ][ 0 ] === null ) {
			insert.push( transactions[ i ][ 1 ] );
		} else if ( transactions[ i ][ 1 ] === null ) {
			remove.push( transactions[ i ][ 0 ] );
		} else {
			oldToNew[ transactions[ i ][ 0 ] ] = transactions[ i ][ 1 ];
			newToOld[ transactions[ i ][ 1 ] ] = transactions[ i ][ 0 ];
			change[ transactions[ i ][ 0 ] ] = transactions[ i ][ 1 ];
		}
	}

	const rem = remove.slice();
	const ins = insert.slice();

	remove.sort( ( a, b ) => a - b );
	insert.sort( ( a, b ) => a - b );

	for ( let i = 0, j = 0; i < ilen && j < jlen; i++, j++ ) {
		if ( i === remove[ 0 ] ) {
			// Old node is a remove
			remove.shift();
			j--;
		} else if ( j === insert[ 0 ] ) {
			// New node is an insert
			insert.shift();
			i--;
		} else if ( !( i in oldToNew ) && !( j in newToOld ) ) {
			// Neither is changed, so they must correspond
			// NB Moves don't exist to the tree differ
			oldToNew[ i ] = j;
			newToOld[ j ] = i;
		} else if ( !( i in oldToNew ) ) {
			// Old node is unchanged, new node is changed
			i--;
		} else if ( !( j in newToOld ) ) {
			// New node is unchanged, old node is changed
			j--;
		}
	}

	return {
		oldToNew: oldToNew,
		newToOld: newToOld,
		remove: rem,
		insert: ins,
		change: change
	};
};
