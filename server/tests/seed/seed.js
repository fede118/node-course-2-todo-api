const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
	_id: userOneId,
	email: 'andy@example.com',
	password: 'useronepass',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userOneId, access: 'auth'}, 'fede').toString()
	}]
}, {
	_id: userTwoId,
	email: 'fed@example.com',
	password: 'usertwopass',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userTwoId, access: 'auth'}, 'fede').toString()
	}]
}];

const todos = [{
	_id: new ObjectID(),
	text: 'First test todo',
	_creator: userOneId
}, {
	_id: new ObjectID(),
	text: 'Second test todo',
	completed: true,
	completedAt: 456798,
	_creator: userTwoId
}];

const populateTodos = (done) => {
	Todo.deleteMany({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done());
};

const populateUsers = (done) => {
	User.deleteMany({}).then(() => {
		var userOne = new User(users[0]).save();
		var userTwo = new User(users[1]).save();

		return Promise.all([userOne, userTwo]);
	}).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};