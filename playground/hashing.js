const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123asabc';

bcrypt.genSalt(10, (err, salt) => {
	bcrypt.hash(password, salt, (err, hash) => {
		console.log(hash);
	});
});

bcrypt.compare(password, '$2a$10$uF.l/BIbxqziY3e8L.mFGu8QdeiZXZafDqJ/.1OR6hXVu6kHQzfwy', (err, res) => {
	console.log(res);
});

// var data = {
// 	id: 5
// };


// var token = jwt.sign(data, 'ponzio');
// console.log(token);

// var decoded = jwt.verify(token, 'ponzio');
// console.log('decoded: ', decoded);

// var message = 'I am user n1';

// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
// 	id: 4
// };

// var token = {
// 	data,
// 	hash: SHA256(JSON.stringify(data) + 'secret').toString()
// };

// var resultHash = SHA256(JSON.stringify(token.data) + 'secret').toString();

// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();

// if (resultHash === token.hash) {
// 	console.log("Data was not changed");
// } else {
// 	console.log("Data changed, untrustworthy");
// }