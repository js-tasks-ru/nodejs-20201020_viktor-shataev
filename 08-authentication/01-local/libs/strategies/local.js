const LocalStrategy = require( 'passport-local' ).Strategy;
const UserModel = require( '../../models/User' );

module.exports = new LocalStrategy(
	{ usernameField: 'email', session: false },
	async function ( email, password, done ) {
		const user = await UserModel.findOne( { email: email } );

		if ( !user ) {
			done( null, false, 'Нет такого пользователя' );
		}

		const isValidPassword = await user.checkPassword( password );

		if (isValidPassword){
			done( null, user )
		} else {
			done( null, false, 'Неверный пароль' );
		}
	},
);
