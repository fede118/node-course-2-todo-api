const mongoose = require('mongoose');
let db = {
	localhost: 'mongodb://localhost:27017/TodoApp',
	mlab: "mongodb://fede118:lacuenta1@ds255784.mlab.com:55784/todo-api"
}
mongoose.Promise = global.Promise;
mongoose.connect(process.env.PORT ? db.mlab : db.localhost, {useNewUrlParser: true});
// mongoose.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true} || "mongodb://fede118:lacuenta1@ds255784.mlab.com:55784/todo-api");

module.exports = {mongoose};