// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
	if (err) {
		return console.log('Unable to connect to mongodb.')
	}
	console.log('Connected to mongodb');
	const db = client.db('TodoApp');

	// db.collection('Todos').insertOne({
	// 	text: 'something to do',
	// 	completed: false,
	// }, (err, result) => {
	// 	if (err) {
	// 		return console.log('unable to insert data', err);
	// 	}

	// 	console.log(JSON.stringify(result.ops, undefined, 2));
	// });


	// db.collection('Users').insertOne({
	// 	user: 'Fede',
	// 	age: 27,
	// 	location: 'Mendoza',
	// }, (err, result) => {
	// 	if (err) {
	// 		return console.log('Unable to write data', err)
	// 	}

	// 	console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
	// });

	client.close();
});