/*
Abstract node
 */

// Abstract node, for when making nodes from scratch
// Label determines equality between nodes
diff.abstractNode = function ( label ) {
	this.label = label;
};

// Override diff.treeNode isEqual method
// Check if this node is equal to another node
diff.treeNode.prototype.isEqual = function ( otherNode ) {
	if ( this.node.label === otherNode.node.label ) {
		return true;
	}
	return false;
};
