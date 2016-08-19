/*
Differ
 */

// Differ, compares two trees and stores the distance
// Algorithm outlined in: http://epubs.siam.org/doi/abs/10.1137/0218082?journalCode=smjcat
// In the future, should return transactions to get from tree1 to tree2
de.differ = function ( tree1, tree2 ) {

	var i, ilen, j, jlen, forestDists;

	forestDists = {
		null: {
			null: 0
		}
	};
	this.treeDistances = {};

	for ( i = 0, ilen = tree1.orderedNodes.length; i < ilen; i++ ) {

		// Add keys to forestDists (with placeholder 0), which will be
		// used to store temporary forest distances.
		forestDists[i] = {
			null: 0
		};
		for ( j = 0, jlen = tree2.orderedNodes.length; j < jlen; j++ ) {
			forestDists[null][j] = 0;
			forestDists[i][j] = 0;
		}

		// Initialize this.treeDistances, a permanent distances store
		this.treeDistances[i] = {};

	}

	this.getDiff( tree1, tree2, forestDists );

};

de.differ.prototype.getDiff = function ( tree1, tree2, forestDists ) {
	var i, ilen, j, jlen;

	for ( i = 0, ilen = tree1.keyRoots.length; i < ilen; i++ ) {
		for ( j = 0, jlen = tree2.keyRoots.length; j < jlen; j++ ) {
			// In the future, getTransactions?
			this.getTreeDistances( tree1.orderedNodes[tree1.keyRoots[i]], tree2.orderedNodes[tree2.keyRoots[j]], tree1.orderedNodes, tree2.orderedNodes, forestDists );
		}
	}
};

de.differ.prototype.getNodeDistance = function ( node1, node2 ) {
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

// Finds distances between trees rooted at particular nodes
de.differ.prototype.getTreeDistances = function ( keyRoot1, keyRoot2, orderedNodes1, orderedNodes2, forestDists ) {
	var i, j, iMinus1, jMinus1;

	// Record costs of forest -> null and null -> forest
	for ( i = keyRoot1.leftmost; i < keyRoot1.index + 1; i++ ) {
		forestDists[i][null] = i - keyRoot1.leftmost + 1;
	}
	for ( j = keyRoot2.leftmost; j < keyRoot2.index + 1; j++ ) {
		forestDists[null][j] = j - keyRoot2.leftmost + 1;
	}

	// Populate this.treeDistances
	for ( i = keyRoot1.leftmost; i < keyRoot1.index + 1; i++ ) {
		iMinus1 = i === keyRoot1.leftmost ? null : i - 1;

		for ( j = keyRoot2.leftmost; j < keyRoot2.index + 1; j++ ) {
			jMinus1 = j === keyRoot2.leftmost ? null : j - 1;

			if ( orderedNodes1[i].leftmost === keyRoot1.leftmost && orderedNodes2[j].leftmost === keyRoot2.leftmost ) {
				forestDists[i][j] = Math.min(
					forestDists[iMinus1][j] + 1,
					forestDists[i][jMinus1] + 1,
					forestDists[iMinus1][jMinus1] + this.getNodeDistance( orderedNodes1[i], orderedNodes2[j] )
				);
				this.treeDistances[i][j] = forestDists[i][j];
			} else {
				forestDists[i][j] = Math.min(
					forestDists[iMinus1][j] + 1,
					forestDists[i][jMinus1] + 1,
					forestDists[iMinus1][jMinus1] + this.treeDistances[i][j]
				);
			}

		}

	}
};
