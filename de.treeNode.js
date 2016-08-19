/*
Tree node
 */

// Tree node, a wrapper node for building trees
de.treeNode = function ( node ) {
	// Labels determine equality, indices determine order
	this.node = node;
	this.children = [];
};

// Add children to create the tree structure
// For full tree functionality, need to make a diff.tree
de.treeNode.prototype.addChild = function ( child ) {
	this.children.push( child );
};
