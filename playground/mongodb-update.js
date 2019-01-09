// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
	if (err) {
		return console.log('Unable to connect to mongodb.')
	}
	console.log('Connected to mongodb');
	const db = client.db('TodoApp');

	// db.collection('Todos').findOneAndUpdate({
	// 	_id: new ObjectID("5c3636e4586d651257f844d9")
	// }, {
	// 	$set: {
	// 		completed: true
	// 	}
	// }, {
	// 	returnOriginal: false
	// }).then((result) => {
	// 	console.log(result);
	// });

	db.collection('Users').findOneAndUpdate({
		_id: new ObjectID('5c34a6c41d212425583aa783')
	}, {
		$set: {	user: 'Fede'},
		$inc: { age: 1 }
	}, {
		returnOriginal: false
	}).then((result) => {
		console.log(result);
	});

	// client.close();
});