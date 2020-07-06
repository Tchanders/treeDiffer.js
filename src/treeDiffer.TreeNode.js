/*!
 * treeDiffer.TreeNode
 *
 * Released under the MIT license
 */

/**
 * TreeNode
 *
 * Abstract TreeNode class for Trees to be diffed. It should be extended,
 * then a Tree should be built by passing the root node and the name of
 * the new class into the Tree constructor.
 *
 * @class
 * @constructor
 * @param {Object} node Object representing a node to be wrapped
 */
treeDiffer.TreeNode = function ( node ) {
	/**
	 * @property {Object} node Object representing the wrapped node
	 */
	this.node = node;

	/**
	 * @property {treeDiffer.TreeNode[]} children Child nodes
	 */
	this.children = [];

	/**
	 * @property {number} index Index in node list ordered by deepest-first then document order
	 */
	this.index = null;

	/**
	 * @property {number} leftmost Leftmost of this node; see treeDiffer.Tree
	 */
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
 * @method
 * Check if another TreeNode is equal to this node. Conditions for equality
 * will depend on the use case.
 *
 * @param {treeDiffer.TreeNode} other The other TreeNode
 * @return {boolean} True if equal
 */
treeDiffer.TreeNode.prototype.isEqual = null;

/**
 * Get the children of the node that this tree node wraps. How to
 * find and filter children will depend on the use case.
 *
 * @method
 * @return {Object[]} Children of the wrapped node
 */
treeDiffer.TreeNode.prototype.getOriginalNodeChildren = null;
