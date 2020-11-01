const stream = require( 'stream' );
const LimitExceededError = require( './LimitExceededError' );

class LimitSizeStream extends stream.Transform {
	constructor ( options ) {
		super( options );

		this.options = options;
		this.tranferedSize = 0;
	}

	_transform ( chunk, encoding, callback ) {
		const chunkSize = chunk.length;

		if ( this.tranferedSize + chunkSize <= this.options.limit ) {
			this.tranferedSize += chunk.length;

			callback( null, chunk );
		} else {
			callback( new LimitExceededError() );
		}
	}
}

module.exports = LimitSizeStream;
