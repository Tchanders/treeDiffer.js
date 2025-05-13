/**
 * Example of how to diff two trees in 5 steps. NB this example depends
 * on the OOJS library for inheritance, but other implementations don't
 * have to.
 *
 * 1. Extend treeDiffer.TreeNode class to work with the real-world nodes
 * 2. Define isEqual and getOriginalNodeChildren methods for this class
 * 3. Make Trees, passing in the root nodes and the new class name
 * 4. Diff the Trees using the Differ
 * 5. Display the diffs
 */

// STEP 1 & 2 - See DomTreeNode.js

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

/**
 * Find and display the diff between two HTML trees.
 */
treeDiffer.showExampleDiff = function () {
	const treeInput1 = document.getElementsByClassName( 'treeInput1' )[ 0 ],
		treeInput2 = document.getElementsByClassName( 'treeInput2' )[ 0 ],
		diff1 = document.getElementsByClassName( 'diff1' )[ 0 ],
		diff2 = document.getElementsByClassName( 'diff2' )[ 0 ],
		root1 = document.createElement( 'div' ),
		root2 = document.createElement( 'div' );

	root1.innerHTML = treeInput1.value;
	root2.innerHTML = treeInput2.value;

	/**
	 * Add class to the DOM element, or wrapper span if it is a text node
	 *
	 * @param {Node} node DOM node that has been removed, inserted or changed
	 * @param {string} className Class to add
	 */
	function addClassToNode( node, className ) {
		let span;
		if ( node.nodeType === Node.TEXT_NODE ) {
			// Wrap text node in span
			span = document.createElement( 'span' );
			// Insert span adjacent to text node
			node.parentNode.insertBefore( span, node );
			// Move text node inside span
			span.appendChild( node );
			node = span;
		}
		node.classList.add( className );
	}

	// STEP 3

	const tree1 = new treeDiffer.Tree( root1, treeDiffer.DomTreeNode );
	const tree2 = new treeDiffer.Tree( root2, treeDiffer.DomTreeNode );

	// STEP 4

	const diff = new treeDiffer.Differ( tree1, tree2 )
		.transactions[ tree1.orderedNodes.length - 1 ][ tree2.orderedNodes.length - 1 ];

	// STEP 5

	for ( let i = 0, ilen = diff.length; i < ilen; i++ ) {
		if ( diff[ i ][ 0 ] !== null && diff[ i ][ 1 ] !== null ) {
			addClassToNode( tree1.orderedNodes[ diff[ i ][ 0 ] ].node, 'change' );
			addClassToNode( tree2.orderedNodes[ diff[ i ][ 1 ] ].node, 'change' );
		} else if ( diff[ i ][ 0 ] ) {
			addClassToNode( tree1.orderedNodes[ diff[ i ][ 0 ] ].node, 'remove' );
		} else if ( diff[ i ][ 1 ] ) {
			addClassToNode( tree2.orderedNodes[ diff[ i ][ 1 ] ].node, 'insert' );
		}
	}
	diff1.innerHTML = '';
	diff2.innerHTML = '';
	diff1.appendChild( root1 );
	diff2.appendChild( root2 );

};

treeDiffer.showExampleDiff();

document.getElementsByClassName( 'update' )[ 0 ].addEventListener( 'click', () => {
	treeDiffer.showExampleDiff();
} );
