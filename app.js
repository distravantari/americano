const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
require('dotenv').config();

const app = express();

const indexRouter = require("./routes/view.js");
const DBRouter = require("./routes/api.js");
const response = require("./response/apiresponse.js");

// DB connection
var MONGODB_URL = process.env.DB_URL;
const mongoose = require("mongoose");

mongoose.connect(MONGODB_URL).then(() => {
	//don't show the log when it is test
	if(process.env.NODE_ENV !== "test") {
		console.log("Connected to %s", MONGODB_URL);
		console.log("App is running ... \n");
		console.log("Press CTRL + C to stop the process. \n");
	}
}).catch(err => {
	console.error("App starting error:", err.message);
	process.exit(1);
});
var db = mongoose.connection;
// console.log("db", db.collection());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static Files
app.use(express.static(path.join(__dirname, "/static")));

// Set Templating Engine
app.use(expressLayouts).set("view engine", "ejs").set("views", path.join(__dirname, "/content"));

//Route Prefixes
app.use("/", indexRouter);
app.use("/connect/", DBRouter);

// throw 404 if URL not found
app.all("*", function(req, res) {
	res.render("pages/404", {
      layout: path.join(__dirname, "/layouts/main"),
      navigation: false,
      footer: false,
  });
});

app.use((err, req, res) => {
	if(err.name == "UnauthorizedError"){
		return response.unauthorizedResponse(res, err.message);
	}
});

app.listen(80, () => {
  console.log("Server running on port 80");
});

