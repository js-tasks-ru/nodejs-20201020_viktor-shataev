const url = require( 'url' );
const http = require( 'http' );
const path = require( 'path' );
const fs = require( 'fs' );
const LimitSizeStream = require( './LimitSizeStream' );

const server = new http.Server();

server.on( 'request', ( req, res ) => {
	const pathname = url.parse( req.url ).pathname.slice( 1 );

	const filepath = path.join( __dirname, 'files', pathname );

	//обращение к файлу, находящемуся во вложенной папке
	if ( pathname.indexOf( '/' ) > -1 ) {

		res.statusCode = 400;
		res.end( 'Bad request' );

	} else {

		switch ( req.method ) {
			case 'POST':
				//Проверка на существование файла
				fs.access( filepath, fs.constants.F_OK, ( error ) => {

					//fs.access передает в колбэк ошибку в том случае, если файл не существует
					if ( !error ) {
						res.statusCode = 409;
						res.end( 'File already exists' );
					} else {
						const limitStream = new LimitSizeStream( { limit: 1000000 } );
						const writeStream = fs.createWriteStream( filepath, { flags: 'wx' } );

						//Если размер файла превышает допустимый, тормозим стрим на запись и удаляем файл
						limitStream.on( 'error', ( error ) => {
							console.log('limitStream error');

							res.statusCode = 413;
							res.end( 'File size is too large' );

							writeStream.on('unpipe', ()=>{
								console.log('unpiped');
								writeStream.close();
							});

							writeStream.on('close', ()=>{
								console.log('closed');

								//Удаляем файл
								fs.unlink( filepath, ( error ) => {
									if ( error ) {
										console.log( error );
									}

									console.log( filepath + ' was deleted' );
								} );

							});

							limitStream.unpipe(writeStream);
						} );

						//Если файла еще не существует и его размер является допустимым,
						//можно создавать новый
						writeStream.on( 'finish', function () {
							console.log( 'finish' );

							res.statusCode = 201;
							res.end( 'Successfully created' );

						} );

						writeStream.on( 'error', ( error ) => {
							res.statusCode = 500;
							res.end( 'Internal Server Error' );
						} );

						req.pipe( limitStream ).pipe( writeStream );
					}
				} );

				break;

			default:
				res.statusCode = 501;
				res.end( 'Not implemented' );
		}
	}
} );

module.exports = server;
