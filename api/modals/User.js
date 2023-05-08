const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserScheme = Schema({
	name: String,
	email: { type: String, unique: true },
	password: String,
});

const UserModel = mongoose.model("User", UserScheme);

module.exports = UserModel;
