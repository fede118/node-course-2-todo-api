const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		trim: true,
		required: true,
		minlength: 1,
		unique: true,
		validate: {
			validator: (value) => validator.isEmail(value),
			message: "{VALUE} is not a valid email"
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 6
	},
	tokens: [{
		access:{
			type: String,
			required: true
		},
		token:{
			type: String,
			required: true
		}
	}]
});

UserSchema.methods.toJSON = function () {
	var user = this;
	var userObject = user.toObject();

	return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
	var user = this;
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString(), access},'fede').toString();

	user.tokens = user.tokens.concat([{access, token}]);

	return user.save().then(() => token);
};

UserSchema.statics.findByToken = function (token) {
	var User = this;
	var decoded;

	try {
		decoded = jwt.verify(token, 'fede');
	} catch (e) {
		return Promise.reject();
	}

	return User.findOne({
		'_id': decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	});
};

UserSchema.pre('save', function (next) {
	var user = this;

	if (user.isModified('password')) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});

var User = new mongoose.model('User', UserSchema);

module.exports = {User};