const stream = require( 'stream' );
const os = require( 'os' );

class LineSplitStream extends stream.Transform {
	constructor ( options ) {
		super( options );

		this.options = options;
		this.lineString = '';
	}

	_transform ( chunk, encoding, callback ) {
		this.lineString += chunk.toString( this.options.encoding );

		callback();
	}

	_flush ( callback ) {
		const lineSeparator = os.EOL;

		this.lineString.split( lineSeparator ).map( lineStr => {
			this.push( lineStr );
		} );

		callback();
	}
}

module.exports = LineSplitStream;
