const url = require( 'url' );
const http = require( 'http' );
const path = require( 'path' );
const fs = require( 'fs' );

const server = new http.Server();

server.on( 'request', ( req, res ) => {
	const pathname = url.parse( req.url ).pathname.slice( 1 );

	const filepath = path.join( __dirname, 'files', pathname );

	if ( pathname.indexOf( '/' ) > -1 ) {
		res.statusCode = 400;

		return res.end();
	}

	switch ( req.method ) {
		case 'DELETE':
			fs.unlink( filepath, ( err ) => {
				if ( err && err.code === 'ENOENT' ) {
					res.statusCode = 404;

					return res.end( 'File not found' );
				} else {
					res.statusCode = 200;

					return res.end( 'Successfully deleted' );
				}
			} );

			break;

		default:
			res.statusCode = 501;
			res.end( 'Not implemented' );
	}
} );

module.exports = server;
