function sum ( a, b ) {
	if ( !isNumber( a ) || !isNumber( b ) ) {
		throw new TypeError;
	}

	return a + b;
}

function isNumber ( val ) {
	return ( typeof val ) === 'number' && !Number.isNaN( val ) && isFinite( val );
}

module.exports = sum;
