/**
 * Example of how to diff two trees in 5 steps:
 *
 * 1. Define the TreeNode isEqual method
 * 2. Wrap the nodes in TreeNodes
 * 3. Make Trees from the root TreeNodes
 * 4. Diff the Trees using the Differ
 * 5. Display the diffs
 */

/**
 * Step 1.
 *
 * Override for TreeNode isEqual method. Here nodes are considered equal if they
 * have the same tagName, or are text nodes with the same text content.
 *
 * @param {treeDiffer.TreeNode} otherNode The node to compare to this node
 * @return {boolean} Nodes are equal
 */
treeDiffer.TreeNode.prototype.isEqual = function ( otherNode ) {
	if ( this.node.nodeType === Node.TEXT_NODE ) {
		return otherNode.node.nodeType === Node.TEXT_NODE &&
			otherNode.node.textContent === this.node.textContent;
	} else {
		return otherNode.node.tagName === this.node.tagName;
	}
};

/**
 * Steps 2 - 4.
 *
 * Find and display the diff between two HTML trees.
 */
treeDiffer.showExampleDiff = function () {
	var i, ilen, diff, tree1, tree2, tree1Root, tree2Root,
		root1 = document.getElementsByClassName( 'root1' )[ 0 ],
		root2 = document.getElementsByClassName( 'root2' )[ 0 ],
		root1Clone = root1.cloneNode( true ),
		root2Clone = root2.cloneNode( true );

	/**
	 * Wrap arbitrary nodes in TreeNodes, recording parent-child relationships
	 *
	 * @param {Object} parentNode Node to wrap
	 */
	function wrapNodes( parentNode ) {
		var i, ilen, childNode, childTreeNode,
			childNodes = parentNode.node.childNodes;

		for ( i = 0, ilen = childNodes.length; i < ilen; i++ ) {

			childNode = childNodes[ i ];

			// Ignore whitespace nodes
			if ( !( childNode.nodeType === Node.TEXT_NODE && childNode.textContent.match( /^\s*$/ ) ) ) {

				childTreeNode = new treeDiffer.TreeNode( childNodes[ i ] );
				parentNode.addChild( childTreeNode );
				wrapNodes( childTreeNode );

			}
		}
	}

	/**
	 * Add class to the DOM element, or its parent if it is a text node
	 *
	 * @param {treeDiffer.TreeNode} treeNode Node that has been removed, inserted or changed
	 * @param {string} className Class to add
	 */
	function addClassToNode( treeNode, className ) {
		if ( treeNode.node.nodeType === Node.TEXT_NODE ) {
			treeNode = treeNode.parent;
		}
		treeNode.node.classList.add( className );
	}

	// Step 2.
	tree1Root = new treeDiffer.TreeNode( root1 );
	tree2Root = new treeDiffer.TreeNode( root2 );
	wrapNodes( tree1Root );
	wrapNodes( tree2Root );

	// Step 3.
	tree1 = new treeDiffer.Tree( tree1Root );
	tree2 = new treeDiffer.Tree( tree2Root );

	// Step 4.
	diff = new treeDiffer.Differ( tree1, tree2 )
		.transactions[ tree1.orderedNodes.length - 1 ][ tree2.orderedNodes.length - 1 ];

	// Step 5.
	for ( i = 0, ilen = diff.length; i < ilen; i++ ) {
		if ( diff[ i ][ 0 ] !== null && diff[ i ][ 1 ] !== null ) {
			addClassToNode( tree1.orderedNodes[ diff[ i ][ 0 ] ], 'change' );
			addClassToNode( tree2.orderedNodes[ diff[ i ][ 1 ] ], 'change' );
		} else if ( diff[ i ][ 0 ] ) {
			addClassToNode( tree1.orderedNodes[ diff[ i ][ 0 ] ], 'remove' );
		} else if ( diff[ i ][ 1 ] ) {
			addClassToNode( tree2.orderedNodes[ diff[ i ][ 1 ] ], 'insert' );
		}
	}
	document.getElementsByClassName( 'diff1' )[ 0 ].appendChild( root1 );
	document.getElementsByClassName( 'diff2' )[ 0 ].appendChild( root2 );
	document.getElementsByClassName( 'tree1' )[ 0 ].appendChild( root1Clone );
	document.getElementsByClassName( 'tree2' )[ 0 ].appendChild( root2Clone );

};

treeDiffer.showExampleDiff();
