function parseHtml( htmlString ) {
	const tempDiv = document.createElement( 'div' );
	tempDiv.innerHTML = htmlString;
	return tempDiv.firstChild;
}

// Test suite using QUnit
QUnit.module( 'treeDiffer.js', () => {
	QUnit.test( 'Transactions', ( assert ) => {
		const cases = [
			{
				html1: '<div></div>',
				html2: '<div></div>',
				expectedTransactions: [],
				msg: 'Empty tree should have no transactions'
			},
			{
				html1: '<div></div>',
				html2: '<div><span></span></div>',
				expectedTransactions: [ [ null, 0 ] ],
				msg: 'Simple insert should have one insert transaction'
			},
			{
				html1: '<div><span></span></div>',
				html2: '<div></div>',
				expectedTransactions: [ [ 0, null ] ],
				msg: 'Simple delete should have one delete transaction'
			},
			{
				html1: '<div><span>Old Text</span></div>',
				html2: '<div><span>New Text</span></div>',
				expectedTransactions: [ [ 0, 0 ] ],
				msg: 'Simple change should have one change transaction'
			},
			{
				html1: '<div><span><strong>Text 1</strong></span><p>Text 2</p></div>',
				html2: '<div><span><strong>Text 1</strong></span><p><em>Text 3</em></p><div>Text 4</div></div>',
				expectedTransactions: [
					[ 3, 3 ],
					[ null, 4 ],
					[ null, 6 ],
					[ null, 7 ]
				],
				msg: 'Complex tree with insert and delete'
			},
			{
				html1: '<div>Old Text</div>',
				html2: '<div>New Text</div>',
				expectedTransactions: [ [ 0, 0 ] ],
				msg: 'Only text changes'
			},
			{
				html1: '<div><section><p>Paragraph 1</p><p>Paragraph 2</p></section></div>',
				html2: '<div><section><p>Paragraph 1</p><div>Inserted</div><p>Paragraph 2</p></section></div>',
				expectedTransactions: [
					[ null, 2 ],
					[ null, 3 ]
				],
				msg: 'Nested elements insert'
			},
			{
				html1: '<div><h1>Title</h1><p>Paragraph 1</p><ul><li>Item 1</li><li>Item 2</li></ul><p>Paragraph 2</p></div>',
				html2: '<div><h2>Title</h2><p>Paragraph 1</p><ul><li>Item 1</li><li>Item 3</li><li>Item 4</li></ul><div>New Paragraph</div><p>Paragraph 2</p></div>',
				expectedTransactions: [
					[ 1, 1 ],
					[ 6, 6 ],
					[ null, 8 ],
					[ null, 9 ],
					[ null, 11 ],
					[ null, 12 ]
				],
				msg: 'Complex mixed operations'
			},
			{
				html1: '<div><p>Original Text</p></div>',
				html2: '<div><p>Modified Text</p></div>',
				expectedTransactions: [ [ 0, 0 ] ],
				msg: 'Text change in element'
			},
			{
				html1: '<div>Hello</div>',
				html2: '<div>World</div>',
				expectedTransactions: [ [ 0, 0 ] ],
				msg: 'Tree with only text'
			}
		];

		cases.forEach( ( { html1, html2, expectedTransactions, msg } ) => {
			const tree1 = new treeDiffer.Tree( parseHtml( html1 ), treeDiffer.DomTreeNode );
			const tree2 = new treeDiffer.Tree( parseHtml( html2 ), treeDiffer.DomTreeNode );
			const differ = new treeDiffer.Differ( tree1, tree2 );
			const transactions = differ.transactions[ tree1.root.index ][ tree2.root.index ];
			assert.deepEqual( transactions, expectedTransactions, msg );
		} );
	} );
} );
