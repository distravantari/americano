const mongoose = require("mongoose");

var scheme = mongoose.Schema;

var MatchSchema = new scheme({
	accountID: {type: String, required: true},
    name: {type: String, required: false},
	round: {type: Object, required: true},
	standing: {type: Object, required: true},
}, {timestamps: true});

module.exports = mongoose.model("match", MatchSchema);;