const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		var text = 'Test todo text';

		request(app)
			.post('/todos')
			.set('x-auth', users[0].tokens[0].token)
			.send({text})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find({text}).then((todos) => {
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch((e) => done(e));
			});
	});

	it('should not create todo with invalid body data', (done) => {
		request(app)
		.post('/todos')
		.set('x-auth', users[0].tokens[0].token)
		.send({})
		.expect(400)
		.end((err, res) => {
			if (err) {
				return done(err);
			}

			Todo.find().then((todos) => {
				expect(todos.length).toBe(2);
				done();
			}).catch((e) => done(e));
		});
	});
});

describe('GET /todos', () => {
	it('should get all todos', (done) => {
		request(app)
		.get('/todos')
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)
		.expect((res) => {
			expect(res.body.todos.length).toBe(1);
		})
		.end(done);
	})
});

describe('GET /todos/:id', () => {
	it('Should return todo doc', (done) => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end(done);
	});

	it('Should not return todo doc created by other user', (done) => {
		request(app)
			.get(`/todos/${todos[1]._id.toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it('should return 404 if todo not found' , (done) => {
		var id = new ObjectID().toHexString();
		request(app)
			.get(`/todos/${id}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it('should return 404 for non-object ids', (done) => {
		request(app)
			.get('/todos/123456')
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});
});

describe("DELETE /todos/:id", () => {
	it('should remove a todo', (done) => {
		var hexId = todos[1]._id.toHexString();

		request(app)
			.delete(`/todos/${hexId}`)
			.set('x-auth', users[1].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo._id).toBe(hexId);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.findById(hexId).then((todo) => {
					expect(todo).toBeFalsy();
					done();
				}).catch((e) => done(e));
			});
	});

	it('should not remove a todo from other user', (done) => {
		var hexId = todos[0]._id.toHexString();

		request(app)
			.delete(`/todos/${hexId}`)
			.set('x-auth', users[1].tokens[0].token)
			.expect(404)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.findById(hexId).then((doc) => {
					expect(doc).toBeTruthy();
					done();
				}).catch((e) => done(e));
			});
	});

	it('should return 404 if todo not found', (done) => {
		var id = new ObjectID().toHexString();
		request(app)
			.delete(`/todos/${id}`)
			.set('x-auth', users[1].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it('should return 404 if object id is invalid', (done) => {
		request(app)
			.get('/todos/123456')
			.set('x-auth', users[1].tokens[0].token)
			.expect(404)
			.end(done);
	});
});

describe('PATCH /todos/:id', () => {
	it('should update the todo', (done) => {
		var _id = todos[0]._id.toHexString();
		var body = {text: 'testing', completed: true};
		request(app)
			.patch(`/todos/${_id}`)
			.set('x-auth', users[0].tokens[0].token)
			.send(body)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(body.text);
				expect(res.body.todo.completed).toBe(true);
				expect(typeof res.body.todo.completedAt).toBe('number');
				done();
		}).catch((e) => done(e));
	});

	it('should not update the todo of other user', (done) => {
		var _id = todos[0]._id.toHexString();
		var body = {text: 'testing', completed: true};
		request(app)
			.patch(`/todos/${_id}`)
			.set('x-auth', users[1].tokens[0].token)
			.send(body)
			.expect(404)
			.end(done);
	});

	it('should clear completedAt when todo is not completed', (done) => {
		var _id = todos[1]._id.toHexString();
		var body = {text: 'testing 2', completed: false};
		request(app)
			.patch(`/todos/${_id}`)
			.set('x-auth', users[1].tokens[0].token)
			.send(body)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(body.text);
				expect(res.body.todo.completed).toBe(false);
				expect(res.body.todo.completedAt).toBeFalsy();
				done();
			}).catch((e) => done(e));
	});
});

describe('GET /users/me', () => {
	it('should return user if authenticated', (done) => {
		request(app)
			.get('/users/me')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body._id).toBe(users[0]._id.toHexString());
				expect(res.body.email).toBe(users[0].email);
			}).end(done);
	});

	it('should return a 401 if not authenticated', (done) => {
		request(app)
			.get('/users/me')
			.expect(401)
			.expect((res) => {
				expect(res.body).toEqual({});
			}).end(done);
	});
});

describe('POST /users', () => {
	it('should create a user', (done) => {
		var email = 'example@example.com';
		var password = 'pass123';

		request(app)
			.post('/users')
			.send({email, password})
			.expect(200)
			.expect((res) => {
				expect(res.header['x-auth']).toBeTruthy();
				expect(res.body._id).toBeTruthy();
				expect(res.body.email).toBe(email);
			}).end((err) => {
				if (err) {
					return done(err);
				}

				User.findOne({email}).then((user) => {
					expect(user).toBeTruthy();
					expect(user.password).not.toBe(password);
					done();
				}).catch((e) => done(e));
			});
	});

	it('should return validation errors if request invalid', (done) => {
		request(app)
			.post('/users')
			.send({email: 'asdasd', password: '1234'})
			.expect(400)
			.end(done);
	});

	it('should not create user if email in use', (done) => {
		request(app)
			.post('/users')
			.send({email: users[0].email, password: '123456'})
			.expect(400)
			.end(done);
	});
});

describe('POST /userse/login', () => {
	it('should login user and return auth token', (done) => {
		request(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password: users[1].password
			}).expect(200)
			.expect((res) => {
				expect(res.header['x-auth']).toBeTruthy();
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				User.findById(users[1]._id).then((user) => {
					expect(user.toObject().tokens[1]).toMatchObject({
						access: 'auth',
						token: res.headers['x-auth']
					});
					done();
				}).catch((e) => done(e));
			});
	});

	it('should reject invalid login', (done) => {
		request(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password: 'caca'
			}).expect(400)
			.expect((res) => {
				expect(res.header['x-auth']).toBeFalsy();
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				User.findById(users[1]._id).then((user) => {
					expect(user.tokens).toHaveLength(1);
					done();
				}).catch((e) => done(e));
			});
	});
});

describe('DELETE /users/me/token', () => {
	it('should remove auth token on logout', (done) => {
		request(app)
			.delete('/users/me/token')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				User.findById(users[0]._id).then((user) => {
					expect(user.tokens).toHaveLength(0);
					done();
				}).catch((e) => done(e));
			});
	});
});