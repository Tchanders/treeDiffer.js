// eslint-disable-next-line strict
if ( typeof module !== 'undefined' && module.exports ) {
	module.exports = treeDiffer;
} else {
	global.treeDiffer = treeDiffer;
}
