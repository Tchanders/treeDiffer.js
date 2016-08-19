/*
Abstract node
 */

// Abstract node, for when making nodes from scratch
// Label determines equality between nodes
de.abstractNode = function ( label ) {
	this.label = label;
};

// Check if this node is equal to another node
de.abstractNode.prototype.isEqual = function ( node ) {
	if ( this.label === node.label ) {
		return true;
	}
	return false;
};
