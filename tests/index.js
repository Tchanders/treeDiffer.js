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
				html1: '<table><thead><tr><th>No.Template:Efn</th><th>Portrait</th><th>Name<p>(Birth–Death)</p></th><th>Term of office</th><th colspan="2">PartyTemplate:Efn</th><th>Election</th><th>Vice President</th></tr></thead><tbody><tr><th rowspan="2">1</th><td rowspan="2"></td><td rowspan="2">George Washington<p>(1732–1799)</p></td><td rowspan="2">Template:Dts<p>–</p>Template:Dts</td><td rowspan="2"></td><td rowspan="2">Unaffiliated</td><td>1788–89</td><td rowspan="2">John AdamsTemplate:Efn</td></tr><tr><td>1792</td></tr><tr><th>2</th><td></td><td>John Adams<p>(1735–1826)</p></td><td>Template:Dts<p>–</p>Template:Dts</td><td>style="background-color:Template:Federalist Party/meta/color" |</td><td>Federalist</td><td>1796</td><td>Thomas JeffersonTemplate:Efn</td></tr><tr><th rowspan="2">3</th><td rowspan="2"></td><td rowspan="2">Thomas Jefferson<p>(1743–1826)</p></td><td rowspan="2">Template:Dts<p>–</p>Template:Dts</td><td>rowspan=2 style="background-color:Template:Democratic-Republican Party/meta/color" |</td><td rowspan="2">Democratic-<p>Republican</p></td><td>1800</td><td>Aaron Burr</td></tr><tr><td>1804</td></tr><tr><th rowspan="4">4</th><td rowspan="4"></td><td rowspan="4">James Madison<p>(1751–1836)</p></td><td rowspan="4">Template:Dts<p>–</p>Template:Dts</td><td>rowspan=4 style="background-color:Template:Democratic-Republican Party/meta/color" |</td><td rowspan="4">Democratic-<p>Republican</p></td><td rowspan="2">1808</td></tr><tr><td>Template:CNone</td></tr><tr><td rowspan="2">1812</td><td>Elbridge GerryTemplate:Efn</td></tr><tr><td>Template:CNone</td></tr><tr><th rowspan="2">5</th><td rowspan="2"></td><td rowspan="2">James Monroe<p>(1758–1831)</p></td><td rowspan="2">Template:Dts<p>–</p>Template:Dts</td><td>rowspan=2 style="background-color:Template:Democratic-Republican Party/meta/color" |</td><td rowspan="2">Democratic-<p>Republican</p></td><td>1816</td><td rowspan="2">Daniel D. Tompkins</td></tr><tr><td>1820</td></tr><tr><th rowspan="2">6</th><td rowspan="2"></td><td rowspan="2">John Quincy Adams<p>(1767–1848)</p></td><td rowspan="2">Template:Dts<p>–</p>Template:Dts</td><td>style="background-color:Template:Democratic-Republican Party/meta/color" |</td><td>Democratic-<p>RepublicanTemplate:Efn</p></td><td rowspan="2">1824</td><td rowspan="3">John C. CalhounTemplate:EfnTemplate:Efn</td></tr><tr><td></td><td>National Republican</td></tr><tr><th rowspan="3">7</th><td rowspan="3"></td><td rowspan="3">Andrew Jackson<p>(1767–1845)</p></td><td rowspan="3">Template:Dts<p>–</p>Template:Dts</td><td>rowspan=3 style="background-color:Template:Democratic Party (United States)/meta/color" |</td><td rowspan="3">Democratic</td><td rowspan="2">1828</td></tr><tr><td>Template:CNone</td></tr><tr><td>1832</td><td>Martin Van Buren</td></tr><tr><th>8</th><td></td><td>Martin Van Buren<p>(1782–1862)</p></td><td>Template:Dts<p>–</p>Template:Dts</td><td>style="background-color:Template:Democratic Party (United States)/meta/color" |</td><td>Democratic</td><td>1836</td><td>Richard Mentor Johnson</td></tr><tr><th>9</th><td></td><td>William Henry HarrisonTemplate:Efn<p>(1773–1841)</p></td><td>Template:Dts<p>–</p>Template:Dts</td><td>style="background-color:Template:Whig Party (United States)/meta/color" |</td><td>Whig</td><td rowspan="3">1840</td><td>John Tyler</td></tr><tr><th rowspan="2">10</th><td rowspan="2"></td><td>rowspan="2"</td><td>John Tyler<p>(1790–1862)</p></td><td rowspan="2">April 4, 1841Template:Efn<p>–</p>Template:Dts</td><td>style="background-color:Template:Whig Party (United States)/meta/color" |</td><td>WhigTemplate:Efn</td></tr><tr><td></td><td>Unaffiliated</td></tr><tr><th>11</th><td></td><td>James K. Polk<p>(1795–1849)</p></td><td>Template:Dts<p>–</p>Template:Dts</td><td>style="background-color:Template:Democratic Party (United States)/meta/color" |</td><td>Democratic</td><td>1844</td><td>George M. Dallas</td></tr><tr><th>12</th><td></td><td>Zachary TaylorTemplate:Efn<p>(1784–1850)</p></td><td>Template:Dts<p>–</p>Template:Dts</td><td>style="background-color:Template:Whig Party (United States)/meta/color" |</td><td>Whig</td><td rowspan="2">1848</td><td>Millard Fillmore</td></tr><tr><th>13</th><td></td><td>Millard Fillmore<p>(1800–1874)</p></td><td>Template:DtsTemplate:Efn<p>–</p>Template:Dts</td><td>style="background-color:Template:Whig Party (United States)/meta/color" |</td><td>Whig</td><td>Template:CNone</td></tr><tr><th rowspan="2">14</th><td rowspan="2"></td><td rowspan="2">Franklin Pierce<p>(1804–1869)</p></td><td rowspan="2">Template:Dts<p>–</p>Template:Dts</td><td>rowspan=2 style="background-color:Template:Democratic Party (United States)/meta/color" |</td><td rowspan="2">Democratic</td><td rowspan="2">1852</td><td>William R. KingTemplate:Efn</td></tr><tr><td>Template:CNone</td></tr><tr><th>15</th><td></td><td>James Buchanan<p>(1791–1868)</p></td><td>Template:Dts<p>–</p>Template:Dts</td><td>style="background-color:Template:Democratic Party (United States)/meta/color" |</td><td>Democratic</td><td>1856</td><td>John C. Breckinridge</td></tr><tr><th rowspan="2">16</th><td rowspan="2"></td><td rowspan="2">Abraham LincolnTemplate:Efn<p>(1809–1865)</p></td><td rowspan="2">Template:Dts<p>–</p>Template:Dts</td><td>style="background-color:Template:Republican Party (United States)/meta/color" |</td><td>Republican</td><td>1860</td><td>Hannibal Hamlin</td></tr><tr><td>style="background-color:Template:National Union Party (United States)/meta/color" |</td><td>National UnionTemplate:Efn</td><td rowspan="3">1864</td><td>Andrew Johnson</td></tr><tr><th rowspan="2">17</th><td rowspan="2"></td><td rowspan="2">Andrew Johnson<p>(1808–1875)</p></td><td rowspan="2">Template:Dts<p>–</p>Template:Dts</td><td>style="background-color:Template:National Union Party (United States)/meta/color" |</td><td>National UnionTemplate:Efn</td><td>rowspan=2 Template:CNone</td></tr><tr><td>style="background-color:Template:Democratic Party (United States)/meta/color" |</td><td>Democratic</td></tr><tr><th rowspan="3">18</th><td rowspan="3"></td><td rowspan="3">Ulysses S. Grant<p>(1822–1885)</p></td><td rowspan="3">Template:Dts<p>–</p>Template:Dts</td><td>rowspan=3 style="background-color:Template:Republican Party (United States)/meta/color" |</td><td rowspan="3">Republican</td><td>1868</td><td>Schuyler Colfax</td></tr><tr><td rowspan="2">1872</td><td>Henry WilsonTemplate:Efn</td></tr><tr><td>Template:CNone</td></tr><tr><th>19</th><td></td><td>Rutherford B. Hayes<p>(1822–1893)</p></td><td>Template:Dts<p>–</p>Template:Dts</td><td>style="background-color:Template:Republican Party (United States)/meta/color" |</td><td>Republican</td><td>1876</td><td>William A. Wheeler</td></tr></tbody><tfoot></tfoot></table>',
				html2: '<table><thead><tr><th>No.Template:Efn</th><th>Portrxait</th><th>Name<p>(Birth–Death)</p></th><th>Term of office</th><th colspan="2">PartyxTemplate:Efn</th><th>Election</th><th>Vice President</th></tr></thead><tbody><tr><th rowspan="2">1</th><td rowspan="2"></td><td rowspan="2">George Washington<p>(1732–1799)</p></td><td rowspan="2">Template:Dts<p>–</p>Template:Dts</td><td rowspan="2"></td><td rowspan="2">Unaffiliated</td><td>1788–89</td><td rowspan="2">John AdamsTemplate:Efn</td></tr><tr><td>1792</td></tr><tr><th>2</th><td></td><td>John Adams<p>(1735–1826)</p></td><td>Template:Dts<p>–</p>Template:Dts</td><td>style="background-color:Template:Federalist Party/meta/color" |</td><td>Fexderalist</td><td>1796</td><td>Thomas JeffersonTemplate:Efn</td></tr><tr><th rowspan="2">3</th><td rowspan="2"></td><td rowspan="2">Thomas Jefferson<p>(1743–1826)</p></td><td rowspan="2">Template:Dts<p>–</p>Temxplate:Dts</td><td>rowspan=2 style="background-color:Template:Democratic-Republican Party/meta/color" |</td><td>1800</td><td>Aaron Burr</td></tr><tr><td>1804</td><td rowspan="2">George ClintonTemplate:Efn</td></tr><tr><th rowspan="4">4</th><td rowspan="4"></td><td rowspan="4">James Madison<p>(1751–1836)</p></td><td rowspan="4">Template:Dts<p>–</p>Template:Dts</td><td>rowspan=4 style="background-color:Template:Democratic-Republican Party/meta/color" |</td><td rowspan="4">Democratic-<p>Republican</p></td><td rowspan="2">1808</td></tr><tr><td>Template:CNone</td></tr><tr><td rowspan="2">1812</td><td>Elbridge GerryTemplate:Efn</td></tr><tr><td>Template:CNone</td></tr><tr><th rowspan="2">5</th><td rowspan="2"></td><td rowspan="2">James Monroe<p>(1758–1831)</p></td><td rowspan="2">Template:Dts<p>–</p>Template:Dts</td><td>rowspan=2 style="background-color:Template:Democratic-Republican Party/meta/color" |</td><td rowspan="2">Democratic-<p>Republican</p></td><td>1816</td><td rowspan="2">Daniel D. Tompkins</td></tr><tr><td>1820</td></tr><tr><th rowspan="2">6</th><td rowspan="2"></td><td rowspan="2">John Quincy Adams<p>(1767–1848)</p></td><td rowspan="2">Template:Dts<p>–</p>Template:Dts</td><td>style="background-color:Template:Democratic-Republican Party/meta/color" |</td><td>Democratic-<p>RepublicanTemplate:Efn</p></td><td rowspan="2">1824</td><td rowspan="3">John C. CalhounTemplate:EfnTemplate:Efn</td></tr><tr><td></td><td>National Republican</td></tr><tr><th rowspan="3">7</th><td rowspan="3"></td><td rowspan="3">Andrew Jackson<p>(1767–1845)</p></td><td rowspan="3">Template:Dts<p>–</p>Template:Dts</td><td>rowspan=3 style="background-color:Template:Democratic Party (United States)/meta/color" |</td><td rowspan="3">Democratic</td><td rowspan="2">1828</td></tr><tr><td>Template:CNone</td></tr><tr><td>1832</td><td>Martin Van Buren</td></tr><tr><th>8</th><td></td><td>Martin Van Buren<p>(1782–1862)</p></td><td>Template:Dts<p>–</p>Template:Dts</td><td>style="background-color:Template:Democratic Party (United States)/meta/color" |</td><td>Democratic</td><td>1836</td><td>Richard Mentor Johnson</td></tr><tr><th>9</th><td></td><td>William Henry HarrisonTemplate:Efn<p>(1773–1841)</p></td><td>Template:Dts<p>–</p>Template:Dts</td><td>style="background-color:Template:Whig Party (United States)/meta/color" |</td><td>Whig</td><td rowspan="3">1840</td><td>John Tyler</td></tr><tr><th rowspan="2">10</th><td rowspan="2"></td><td>rowspan="2"</td><td>John Tyler<p>(1790–1862)</p></td><td rowspan="2">April 4, 1841Template:Efn<p>–</p>Template:Dts</td><td>style="background-color:Template:Whig Party (United States)/meta/color" |</td><td>WhigTemplate:Efn</td></tr><tr><td></td><td>Unaffiliated</td></tr><tr><th>11</th><td></td><td>James K. Polk<p>(1795–1849)</p></td><td>Template:Dts<p>–</p>Template:Dts</td><td>style="background-color:Template:Democratic Party (United States)/meta/color" |</td><td>Democratic</td><td>1844</td><td>George M. Dallas</td></tr><tr><th>12</th><td></td><td>Zachary TaylorTemplate:Efn<p>(1784–1850)</p></td><td>Template:Dts<p>–</p>Template:Dts</td><td>style="background-color:Template:Whig Party (United States)/meta/color" |</td><td>Whig</td><td rowspan="2">1848</td><td>Millard Fillmore</td></tr><tr><th>13</th><td></td><td>Millard Fillmore<p>(1800–1874)</p></td><td>Template:DtsTemplate:Efn<p>–</p>Template:Dts</td><td>style="background-color:Template:Whig Party (United States)/meta/color" |</td><td>Whig</td><td>Template:CNone</td></tr><tr><th rowspan="2">14</th><td rowspan="2"></td><td rowspan="2">Franklin Pierce<p>(1804–1869)</p></td><td rowspan="2">Template:Dts<p>–</p>Template:Dts</td><td>rowspan=2 style="background-color:Template:Democratic Party (United States)/meta/color" |</td><td rowspan="2">Democratic</td><td rowspan="2">1852</td><td>William R. KingTemplate:Efn</td></tr><tr><td>Template:CNone</td></tr><tr><th>15</th><td></td><td>James Buchanan<p>(1791–1868)</p></td><td>Template:Dts<p>–</p>Template:Dts</td><td>style="background-color:Template:Democratic Party (United States)/meta/color" |</td><td>Democratic</td><td>1856</td><td>John C. Breckinridge</td></tr><tr><th rowspan="2">16</th><td rowspan="2"></td><td rowspan="2">Abraham LincolnTemplate:Efn<p>(1809–1865)</p></td><td rowspan="2">Template:Dts<p>–</p>Template:Dts</td><td>style="background-color:Template:Republican Party (United States)/meta/color" |</td><td>Republican</td><td>1860</td><td>Hannibal Hamlin</td></tr><tr><td>style="background-color:Template:National Union Party (United States)/meta/color" |</td><td>National UnionTemplate:Efn</td><td rowspan="3">1864</td><td>Andrew Johnson</td></tr><tr><th rowspan="2">17</th><td rowspan="2"></td><td rowspan="2">Andrew Johnson<p>(1808–1875)</p></td><td rowspan="2">Template:Dts<p>–</p>Template:Dts</td><td>style="background-color:Template:National Union Party (United States)/meta/color" |</td><td>National UnionTemplate:Efn</td><td>rowspan=2 Template:CNone</td></tr><tr><td>style="background-color:Template:Democratic Party (United States)/meta/color" |</td><td>Democratic</td></tr><tr><th rowspan="3">18</th><td rowspan="3"></td><td rowspan="3">Ulysses S. Grant<p>(1822–1885)</p></td><td rowspan="3">Template:Dts<p>–</p>Template:Dts</td><td>rowspan=3 style="background-color:Template:Republican Party (United States)/meta/color" |</td><td rowspan="3">Republican</td><td>1868</td><td>Schuyler Colfax</td></tr><tr><td rowspan="2">1872</td><td>Henry WilsonTemplate:Efn</td></tr><tr><td>Template:CNone</td></tr><tr><th>19</th><td></td><td>Rutherford B. Hayes<p>(1822–1893)</p></td><td>Template:Dts<p>–</p>Template:Dts</td><td>style="background-color:Template:Republican Party (United States)/meta/color" |</td><td>Republican</td><td>1876</td><td>William A. Wheeler</td></tr></tbody><tfoot></tfoot></table>',
				expectedTransactions: [
					[ 2, 2 ], [ 10, 10 ], [ 55, 55 ], [ 72, 72 ], [ 76, null ], [ 77, null ],
					[ 78, null ], [ 79, null ], [ null, 83 ], [ null, 84 ]
				],
				msg: 'Large table'
			},
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
			const differ = new treeDiffer.Differ( tree1, tree2, 10000 );
			const transactions = differ.transactions[ tree1.root.index ][ tree2.root.index ];
			assert.deepEqual( transactions, expectedTransactions, msg );
		} );
	} );
} );
