const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://fede118:lacuenta1@ds255784.mlab.com:55784/todo-api" || 'mongodb://localhost:27017/TodoApp', {useNewUrlParser: true});

module.exports = {mongoose};