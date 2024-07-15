const mongoose = require("mongoose");

var scheme = mongoose.Schema;

var HistorySchema = new scheme({
	accountID: {type: String, required: true},
    matchName: {type: String, required: false},
	result: {type: Object, required: true},
	standing: {type: Object, required: true},
}, {timestamps: true});

module.exports = mongoose.model("history", HistorySchema);;