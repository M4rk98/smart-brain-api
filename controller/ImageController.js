const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: 'a59c783b0f1a494890cfb1f0999f5496'
});

const entryUpdateAction = (req, res, db) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0]);
	})
	.catch(error => res.status(400).json('unable to update entries'))
	;

};

const handleApiCall = (req, res) => {
    app.models.predict(
        Clarifai.FACE_DETECT_MODEL, 
        req.body.input
   	).then(data => {
   		res.json(data);
   	})
}

module.exports = {
	entryUpdateAction,
	handleApiCall
}