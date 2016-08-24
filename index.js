// Simple example

diff.t1 = new diff.treeNode( new diff.abstractNode( 'f' ) );
diff.t1.addChild( new diff.treeNode( new diff.abstractNode( 'd' ) ) );
diff.t1.addChild( new diff.treeNode( new diff.abstractNode( 'e' ) ) );
diff.t1.children[0].addChild( new diff.treeNode( new diff.abstractNode( 'a' ) ) );
diff.t1.children[0].addChild( new diff.treeNode( new diff.abstractNode( 'c' ) ) );
diff.t1.children[0].children[1].addChild( new diff.treeNode( new diff.abstractNode( 'b' ) ) );
diff.tree1 = new diff.tree( diff.t1 );

diff.t2 = new diff.treeNode( new diff.abstractNode( 'f' ) );
diff.t2.addChild( new diff.treeNode( new diff.abstractNode( 'c' ) ) );
diff.t2.addChild( new diff.treeNode( new diff.abstractNode( 'e' ) ) );
diff.t2.children[0].addChild( new diff.treeNode( new diff.abstractNode( 'd' ) ) );
diff.t2.children[0].children[0].addChild( new diff.treeNode( new diff.abstractNode( 'a' ) ) );
diff.t2.children[0].children[0].addChild( new diff.treeNode( new diff.abstractNode( 'b' ) ) );
diff.tree2 = new diff.tree( diff.t2 );

diff.difference = new diff.differ( diff.tree1, diff.tree2 );