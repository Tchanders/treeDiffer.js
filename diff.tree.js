/*
Tree
 */

// Tree, made up of treeNodes
// may need to make this into a forest - should be the same but array of ordered roots
diff.tree = function( node ) {

	this.root = node;
	this.orderedNodes = [];
	this.keyRoots = [];

	this.getKeyRootsAndIndices();

};

// Stores the nodes in order and adds indices to the nodes
diff.tree.prototype.getKeyRootsAndIndices = function () {

	// Adds nodes to an array in post order
	// Also adds indices to the nodes
	function postOrderNodes( node, orderedNodes, leftmostsToKeyRoots ) {
		var i, ilen;

		for ( i = 0, ilen = node.children.length; i < ilen; i++ ) {
			postOrderNodes( node.children[i], orderedNodes, leftmostsToKeyRoots );
		}

		// Record node order
		orderedNodes.push( node );
		node.index = orderedNodes.length - 1;

		// Record index of leftmost node
		// If this node is a leaf, it is its own leftmost
		node.leftmost = node.children.length === 0 ? node.index : node.children[0].leftmost;

		// Update the key root corresponding to this leftmost
		// A key root is the higest indexed node with each leftmost
		leftmostsToKeyRoots[node.leftmost] = node.index;
	}

	var leftmostsToKeyRoots = {};

	// Store the nodes in order
	this.orderedNodes = [];
	postOrderNodes( this.root, this.orderedNodes, leftmostsToKeyRoots );

	// Store the key roots in order of node index
	this.keyRoots = [];
	for ( leftmost in leftmostsToKeyRoots ) {
		this.keyRoots.push( leftmostsToKeyRoots[leftmost] );
	}
	this.keyRoots.sort( function( a, b ) {
		return a - b;
	} );

};
