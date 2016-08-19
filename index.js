// Example from paper

de.t1 = new de.treeNode( new de.abstractNode( 'f' ) );
de.t1.addChild( new de.treeNode( new de.abstractNode( 'd' ) ) );
de.t1.addChild( new de.treeNode( new de.abstractNode( 'e' ) ) );
de.t1.children[0].addChild( new de.treeNode( new de.abstractNode( 'a' ) ) );
de.t1.children[0].addChild( new de.treeNode( new de.abstractNode( 'c' ) ) );
de.t1.children[0].children[1].addChild( new de.treeNode( new de.abstractNode( 'b' ) ) );
de.tree1 = new de.tree( de.t1 );

de.t2 = new de.treeNode( new de.abstractNode( 'f' ) );
de.t2.addChild( new de.treeNode( new de.abstractNode( 'c' ) ) );
de.t2.addChild( new de.treeNode( new de.abstractNode( 'e' ) ) );
de.t2.children[0].addChild( new de.treeNode( new de.abstractNode( 'd' ) ) );
de.t2.children[0].children[0].addChild( new de.treeNode( new de.abstractNode( 'a' ) ) );
de.t2.children[0].children[0].addChild( new de.treeNode( new de.abstractNode( 'b' ) ) );
de.tree2 = new de.tree( de.t2 );

de.difference = new de.differ( de.tree1, de.tree2 );