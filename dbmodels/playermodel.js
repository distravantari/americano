const mongoose = require("mongoose");

var scheme = mongoose.Schema;

var PlayerSchema = new scheme({
	accountID: {type: String, required: true},
    name: {type: String, required: false},
	socialmedia: {type: String, required: true},
	mp: {type: Number, required: true},
    won: {type: Number, required: true},
    lose: {type: Number, required: true},
}, {timestamps: true});

module.exports = mongoose.model("player", PlayerSchema);;