// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
	if (err) {
		return console.log('Unable to connect to mongodb.')
	}
	console.log('Connected to mongodb');
	const db = client.db('TodoApp');

	//deleteMany
	// db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
	// 	console.log(result);
	// });

	// deleteOne
	// db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
	// 	console.log(result);
	// });

	// findOneAndDelete
	// db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
	// 	console.log(result);
	// });

	// db.collection('Users').deleteMany({user: 'Fede'}).then((result) => {
	// 	console.log(result);
	// });

	var id = new ObjectID('5c34ac3d977d05149caea8aa')
	db.collection('Users').findOneAndDelete({_id: id}).then((result) => {
		console.log(result);
	});

	// client.close();
});