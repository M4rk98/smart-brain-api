const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const userController = require('./controller/UserController');
const imageController = require('./controller/ImageController');

const db = knex({
  client: 'pg',
  connectionString: {
    host: process.env.DATABASE_URL,
    ssl: true
  }
});

console.log(db.select().table('users'));

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send({working: "yes"});
});

app.post('/signin', (req, res) => {
	const { email, password } = req.body;

	db.select('email', 'hash').from('login').where('email', '=', email)
	.then(data => {
		const isValid = bcrypt.compareSync(password, data[0].hash);
		if(isValid) {
			db.select().from('users').where('email', '=', email)
			.then(user => {
				res.json(user[0]);
			})
			.catch(error => res.status(400).json('unable to get user'));
		} else {
			res.status(400).json('wrong credentials2');
		}
	})
	.catch(error => res.status(400).json('wrong credentials1'));

});

app.post('/register', (req, res) => {userController.registerAction(req, res, db, bcrypt)});
// Nézhet ki így is: 
/*
app.post('/register', userController.registerAction(db, bcrypt));
mert először lefuttatja a registerAction functiont és utána a (req,res) functiont meghívja
automatikusan!
*/

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	db.select().from('users').where({id}) // ES6 miatt lehetséges mert a kulcs és value ugyanaz
	.then(user => {
		if(user.length)
		{
			res.json(user[0]);
		} else {
			res.status(400).json("Not found");
		}
	})
	//res.json(id);

});

app.put('/image', (req, res) => {imageController.entryUpdateAction(req, res, db)});
app.post('/imageUrl', (req, res) => {imageController.handleApiCall(req, res)});


/*
bcrypt.hash("bacon", null, null, function(err, hash) {
    // Store hash in your password DB.
});

// Load hash from your password DB.
bcrypt.compare("bacon", hash, function(err, res) {
    // res == true
});
bcrypt.compare("veggies", hash, function(err, res) {
    // res = false
});
*/

app.listen(process.env.PORT || 3000, () => {
	console.log("Server is running");
});