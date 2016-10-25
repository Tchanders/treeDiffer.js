/*!
 * treeDiffer.TreeNode
 *
 * Released under the MIT license
 */

/**
 * TreeNode
 *
 * A consistent type of node for building Trees to be diffed. Real-world
 * nodes should be wrapped in TreeNodes, and their relationships
 * specified using addChild. Then a Tree should be built by passing the
 * root node into the Tree constructor.
 *
 * @class
 * @constructor
 * @param {Object} node Object representing a node to be wrapped
 */
treeDiffer.TreeNode = function ( node ) {
	this.node = node;
	this.children = [];
	// These properties will be populated when a Tree is built
	this.index = null;
	this.leftmost = null;
};

/**
 * Add a node to the list of this node's children
 *
 * @param {treeDiffer.TreeNode} child
 */
treeDiffer.TreeNode.prototype.addChild = function ( child ) {
	this.children.push( child );
	child.parent = this;
};

/**
 * Check if another TreeNode is equal to this node. Conditions for equality
 * will depend on the exact use case, so should be specified per
 * implementation.
 */
treeDiffer.TreeNode.prototype.isEqual = null;
