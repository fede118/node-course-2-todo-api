// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
	if (err) {
		return console.log('Unable to connect to mongodb.')
	}
	console.log('Connected to mongodb');
	const db = client.db('TodoApp');

	// db.collection('Todos').find({
	// 		_id: new ObjectID("5c34a5b05f498418249a10d4")
	// }).toArray().then((docs) => {
	// 	console.log('Todos:');
	// 	console.log(JSON.stringify(docs, undefined, 2));
	// }, (err) => {
	// 	console.log('unable to fetch todos', err)
	// });

	// db.collection('Todos').find().count().then((count) => {
	// 	console.log(`Todos count: ${count}`);
	// }, (err) => {
	// 	console.log('unable to fetch todos', err)
	// });

	db.collection('Users').find({user: 'Fede'}).count().then((count) => {
		console.log(`Users named fede: ${count}`);
	}, (err) => {
		console.log('unable to fetcha user', err);
	});

	db.collection('Users').find({user: 'Fede'}).toArray().then((docs) => {
		console.log(docs);
	});

	// client.close();
});