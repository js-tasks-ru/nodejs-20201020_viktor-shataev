const stream = require( 'stream' );
const os = require( 'os' );

class LineSplitStream extends stream.Transform {
	constructor ( options ) {
		super( options );

		this.options = options;
		this.restString = '';
	}

	_transform ( chunk, encoding, callback ) {
		const lineSeparator = os.EOL;
		const lineString = this.restString + chunk.toString( this.options.encoding );
		let lineArr = lineString.split( lineSeparator );

		/*
		Если чанк заканчивается не переносом строки, а строкой
		значит окончание/продолжение этой строки будет передаваться в следующем чанке.
		Поэтому сохраняем эту строку в this.restString, чтобы склеить ее с окончанием/продолжением
		при следующем вызове метода _transform
		*/
		if (lineArr[lineArr.length-1] !== ''){
			this.restString = lineArr.pop();
		}

		lineArr.map(lineStr => {
			this.push( lineStr );
		} );

		callback();
	}

	_flush ( callback ) {
		this.push( this.restString );
		this.restString = '';

		callback();
	}
}

module.exports = LineSplitStream;
