/*!
 * treeDiffer.Tree
 *
 * Released under the MIT license
 */

/**
 * Tree
 *
 * A group of TreeNodes connected by parent-child relationships in a tree
 * structure, along with certain properties that define the exact structure of the
 * tree: the node order, the keyroots, and the leftmost node of each node. (Terms
 * defined in: http://epubs.siam.org/doi/abs/10.1137/0218082?journalCode=smjcat)
 *
 * @class
 * @constructor
 * @param {treeDiffer.TreeNode} node Root node of the tree
 */
treeDiffer.Tree = function ( node ) {

	this.root = node;
	this.orderedNodes = [];
	this.keyRoots = [];

	this.findKeyRootsAndOrderedNodes();

};

/**
 * Find the post-ordering of the tree nodes, the keyroots and the leftmost of each
 * node.
 */
treeDiffer.Tree.prototype.findKeyRootsAndOrderedNodes = function () {
	var leftmost,
		leftmostsToKeyRoots = {};

	/**
	 * Find the tree nodes in post-order, find the leftmost of each node, and store
	 * the order and leftmost as properties of the nodes.
	 *
	 * @param {treeDiffer.TreeNode} node Node currently being checked
	 * @param {Array} orderedNodes Array to be populated with nodes in order
	 * @param {Object} leftmostsToKeyRoots Each keyroot and its leftmost
	 */
	function postOrderNodes( node, orderedNodes, leftmostsToKeyRoots ) {
		var i, ilen;

		for ( i = 0, ilen = node.children.length; i < ilen; i++ ) {
			postOrderNodes( node.children[ i ], orderedNodes, leftmostsToKeyRoots );
		}

		// Record node order
		orderedNodes.push( node );
		node.index = orderedNodes.length - 1;

		// Record index of leftmost node
		// If this node is a leaf, it is its own leftmost
		node.leftmost = node.children.length === 0 ? node.index : node.children[ 0 ].leftmost;

		// Update the key root corresponding to this leftmost
		// A keyroot is the higest indexed node with each leftmost
		leftmostsToKeyRoots[ node.leftmost ] = node.index;
	}

	// Store the nodes in order
	this.orderedNodes = [];
	postOrderNodes( this.root, this.orderedNodes, leftmostsToKeyRoots );

	// Store the key roots in order of node index
	for ( leftmost in leftmostsToKeyRoots ) {
		this.keyRoots.push( leftmostsToKeyRoots[ leftmost ] );
	}
	this.keyRoots.sort( function ( a, b ) {
		return a - b;
	} );

};

/**
 * Get all the descendants of a node
 *
 * @param {treeDiffer.TreeNode} node Node whose descendants to find
 * @return {Array} Descendants of the node
 */
treeDiffer.Tree.prototype.getNodeDescendants = function ( node ) {
	var descendants = [];

	function addDescendants( parentNode ) {
		var i, ilen, childNode;
		for ( i = 0, ilen = parentNode.children.length; i < ilen; i++ ) {
			childNode = parentNode.children[ i ];
			descendants.push( childNode );
			addDescendants( childNode );
		}
	}

	addDescendants( node );

	return descendants;
};
