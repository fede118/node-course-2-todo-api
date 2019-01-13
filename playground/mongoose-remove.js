const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

Todo.findOneAndDelete({_id: '5c3b59f41bfe8d22be550db0'}).then((todo) => {
	console.log(todo);
});