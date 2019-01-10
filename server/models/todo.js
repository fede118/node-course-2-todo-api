var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
	text: {
		type: String,
		required: true, // makes this input as mandatory
		minlength: 1, // strings need to be longer than 1
		trim: true, // takes out white spaces at begining or end
	},
	completed: {
		type: Boolean,
		default: false, // default value
	},
	completedAt: {
		type: Number,
		default: null, 
	}
});

module.exports = {Todo};