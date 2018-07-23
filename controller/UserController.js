// * Ez nézhet ki így is
/*
const registerAction = (db, bcrypt) => (req, res) => {
*/
const registerAction = (req, res, db, bcrypt) => {
	const { name, email, password } = req.body;
	const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		trx('login')
		.insert({
			email: email,
			hash: hash
		})
		.returning('email')
		.then(signin_email => {
			return trx('users')
			.returning('*')
			.insert({
				email: signin_email[0],
				name: name,
				joined: new Date()
			}).then(user => {
				res.json(user[0]);
			})
		})
		.then(trx.commit)
		.catch(trx.rollback)

	})
	.catch(error => res.status(400).json('unable to register'));

}

module.exports = {
	'registerAction': registerAction
}