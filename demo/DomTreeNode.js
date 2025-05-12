/**
 * Tree node for conducting a tree diff on DOM nodes.
 *
 * @class
 * @extends treeDiffer.TreeNode
 *
 * @constructor
 * @param {Node} node DOM node
 */
treeDiffer.DomTreeNode = function ( node ) {
	// Parent constructor
	treeDiffer.DomTreeNode.parent.call( this, node );
};

OO.inheritClass( treeDiffer.DomTreeNode, treeDiffer.TreeNode );

/**
 * Determine whether two tree nodes are equal. Here nodes are considered
 * equal if they have the same tagName (if they are not text nodes), or
 * have the same text content (if they are text nodes).
 *
 * @param {treeDiffer.TreeNode} otherNode The node to compare to this node
 * @return {boolean} Nodes are equal
 */
treeDiffer.DomTreeNode.prototype.isEqual = function ( otherNode ) {
	if ( this.node.nodeType === Node.TEXT_NODE ) {
		return otherNode.node.nodeType === Node.TEXT_NODE &&
			otherNode.node.textContent === this.node.textContent;
	} else {
		return otherNode.node.tagName === this.node.tagName;
	}
};

/**
 * Gets children of the original node.
 *
 * @return {Array} Array of nodes the same type as the original node
 */
treeDiffer.DomTreeNode.prototype.getOriginalNodeChildren = function () {
	const children = [],
		childNodes = this.node.childNodes;

	for ( let i = 0, ilen = childNodes.length; i < ilen; i++ ) {
		const childNode = childNodes[ i ];
		if ( !( childNode.nodeType === Node.TEXT_NODE && childNode.textContent.match( /^\s*$/ ) ) ) {
			children.push( childNode );
		}
	}

	return children;
};
