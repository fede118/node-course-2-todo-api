const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true} || "mongodb://fede118:lacuenta1@ds255784.mlab.com:55784/todo-api");

module.exports = {mongoose};