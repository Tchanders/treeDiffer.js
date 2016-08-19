/*
Abstract node
 */

// Abstract node, for when making nodes from scratch
// Label determines equality between nodes
de.abstractNode = function ( label ) {
	this.label = label;
};

// Override de.treeNode isEqual method
// Check if this node is equal to another node
de.treeNode.prototype.isEqual = function ( otherNode ) {
	if ( this.node.label === otherNode.node.label ) {
		return true;
	}
	return false;
};
