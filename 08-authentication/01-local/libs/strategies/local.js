const LocalStrategy = require( 'passport-local' ).Strategy;
const UserModel = require( '../../models/User' );

module.exports = new LocalStrategy(
	{ usernameField: 'email', session: false },
	async function ( email, password, done ) {
		try {
			const user = await UserModel.findOne( { email: email } );

			if ( !user ) {
				return done( null, false, 'Нет такого пользователя' );
			}

			const isValidPassword = await user.checkPassword( password );

			if ( isValidPassword ) {
				return done( null, user );
			} else {
				return done( null, false, 'Неверный пароль' );
			}
		} catch ( error ) {
			return done(error);
		}
	},
);
