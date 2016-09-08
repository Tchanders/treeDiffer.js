/*
Differ
 */

// Differ, compares two trees and stores the minimum transactions to get from the first
// tree to the second tree. Each transactions is [nodeToRemove, nodeToInsert], either of
// which can be null.
// Algorithm outlined in: http://epubs.siam.org/doi/abs/10.1137/0218082?journalCode=smjcat
diff.differ = function ( tree1, tree2 ) {

	var i, ilen, j, jlen, transactions, indicesToTransactions, transactionIndicesCount = 0;

	// Temporary store of transactions
	transactions = {
		null: {
			null: []
		}
	};

	// Store all the possible transactions, so this.transactions can be an array of
	// pointers to these transactions, to avoid creating each transaction multiple times
	this.transactionIndices = {
		null: {
			null: transactionIndicesCount
		}
	};
	transactionIndicesCount += 1;
	indicesToTransactions = [];
	indicesToTransactions.push( [null, null] );

	// Permanent store of transactions
	this.transactions = {
		null: {}
	};

	// Add keys to transactions stores, and make the transaction indices
	for ( i = 0, ilen = tree1.orderedNodes.length; i < ilen; i++ ) {
		transactions[i] = {
			null: []
		};
		this.transactionIndices[i] = {
			null: transactionIndicesCount
		};
		transactionIndicesCount += 1;
		indicesToTransactions.push( [i, null] );
		for ( j = 0, jlen = tree2.orderedNodes.length; j < jlen; j++ ) {
			transactions[null][j] = [];
			transactions[i][j] = [];

			this.transactionIndices[null][j] = transactionIndicesCount;
			transactionIndicesCount += 1;
			this.transactionIndices[i][j] = transactionIndicesCount;
			transactionIndicesCount += 1;

			indicesToTransactions.push( [null, j] );
			indicesToTransactions.push( [i, j] );
		}
		this.transactions[i] = {};
	}

	this.getDiff( tree1, tree2, transactions, indicesToTransactions );

};

diff.differ.prototype.getDiff = function ( tree1, tree2, transactions, indicesToTransactions ) {
	var i, ilen, j, jlen, iNulls, jNulls, ii, jj, keyRoot1, keyRoot2;

	for ( i = 0, ilen = tree1.keyRoots.length; i < ilen; i++ ) {

		// Make transactions of tree -> null
		keyRoot1 = tree1.orderedNodes[tree1.keyRoots[i]];
		iNulls = [];
		for ( ii = keyRoot1.leftmost; ii < keyRoot1.index + 1; ii++ ) {
			iNulls.push( this.transactionIndices[ii][null] );
			transactions[ii][null] = iNulls.slice();
		}

		for ( j = 0, jlen = tree2.keyRoots.length; j < jlen; j++ ) {

			// Make transactions of null -> tree
			keyRoot2 = tree2.orderedNodes[tree2.keyRoots[j]];
			jNulls = [];
			for ( jj = keyRoot2.leftmost; jj < keyRoot2.index + 1; jj++ ) {
				jNulls.push( this.transactionIndices[null][jj] );
				transactions[null][jj] = jNulls.slice();
			}

			// Get the diff
			this.getTransactions( keyRoot1, keyRoot2, iNulls, jNulls, tree1.orderedNodes, tree2.orderedNodes, transactions );
		}
	}

	for ( i = 0, ilen = tree1.orderedNodes.length; i < ilen; i++ ) {
		for ( j = 0, jlen = tree2.orderedNodes.length; j < jlen; j++ ) {
			if ( this.transactions[i][j] && this.transactions[i][j].length > 0 ) {
				this.transactions[i][j] = this.transactions[i][j].map( function( transactionIndex ) {
					return indicesToTransactions[transactionIndex];
				} );
			}
		}
	}

};

// Here it is assumed that the costs of inserting, removing and relabelling are equal
// Hence the cost of any one operation is always 1
// Modify this for a more complicated cost function, but beware of performance impact
diff.differ.prototype.getNodeDistance = function ( node1, node2 ) {
	if ( node1 === null && node2 === null ) {
		return 0;
	}
	if ( node1 === null || node2 === null ) {
		return 1;
	}
	if ( node1.isEqual( node2 ) ) {
		return 0;
	}
	return 1;
};

// Finds minimum transactions between trees rooted at particular nodes
diff.differ.prototype.getTransactions = function ( keyRoot1, keyRoot2, iNulls, jNulls, orderedNodes1, orderedNodes2, transactions ) {
	var i, j, iMinus1, jMinus1, costs, nodeDistance, transaction, remove, insert, change;

	// Populate this.transactions
	for ( i = keyRoot1.leftmost; i < keyRoot1.index + 1; i++ ) {
		iMinus1 = i === keyRoot1.leftmost ? null : i - 1;

		// Here it is assumed that the costs of inserting, removing and relabelling are equal
		// Hence, the following calls have been replaced with 1:
		// this.getNodeDistance( orderedNodes1[i], null )
		// this.getNodeDistance( null, orderedNodes2[j] )
		// Modify this for a more complicated cost function, but beware of performance impact
		for ( j = keyRoot2.leftmost; j < keyRoot2.index + 1; j++ ) {
			jMinus1 = j === keyRoot2.leftmost ? null : j - 1;

			if ( orderedNodes1[i].leftmost === keyRoot1.leftmost && orderedNodes2[j].leftmost === keyRoot2.leftmost ) {

				// Previous transactions, leading up to a remove, insert or change
				remove = transactions[iMinus1][j];
				insert = transactions[i][jMinus1];
				change = transactions[iMinus1][jMinus1];

				nodeDistance = this.getNodeDistance( orderedNodes1[i], orderedNodes2[j] );

				costs = [
					remove.length + 1,
					insert.length + 1,
					change.length + nodeDistance
				];

				transaction = costs.indexOf( Math.min.apply( null, costs ) );
				if ( transaction === 0 ) {
					// Record a remove
					( transactions[i][j] = remove.slice() ).push(
						this.transactionIndices[i][null]
					);
				} else if ( transaction === 1 ) {
					// Record an insert
					( transactions[i][j] = insert.slice() ).push(
						this.transactionIndices[null][j]
					);
				} else {
					transactions[i][j] = change.slice();
					// If nodes i and j are different, record a change,
					// otherwise there is no transaction
					if ( nodeDistance === 1 ) {
						transactions[i][j].push( this.transactionIndices[i][j] );
					}
				}

				this.transactions[i][j] = transactions[i][j].slice();
			} else {

				// Previous transactions, leading up to a remove, insert or change
				remove = transactions[iMinus1][j];
				insert = transactions[i][jMinus1];
				change = transactions[
					orderedNodes1[i].leftmost - 1 < 0 ? null : orderedNodes1[i].leftmost - 1
				][
					orderedNodes2[j].leftmost - 1 < 0 ? null : orderedNodes2[j].leftmost - 1
				];

				costs = [
					remove.length + 1,
					insert.length + 1,
					change.length + this.transactions[i][j].length
				];

				transaction = costs.indexOf( Math.min.apply( null, costs ) );
				if ( transaction === 0 ) {
					// Record a remove
					( transactions[i][j] = remove.slice() ).push(
						this.transactionIndices[i][null]
					);
				} else if ( transaction === 1 ) {
					// Record an insert
					( transactions[i][j] = insert.slice() ).push(
						this.transactionIndices[null][j]
					);
				} else {
					// Record a change
					transactions[i][j] = change.concat( this.transactions[i][j] );
				}

			}

		}

	}
};


