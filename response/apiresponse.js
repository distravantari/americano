const version = require("../version.js");

function successResponse (res, msg) {
	var data = {
		status: 200,
		version: version,
		message: msg
	};
	return res.status(200).json(data);
};

function successResponseWithData (res, msg, data) {
	var resData = {
		status: 200,
		version: version,
		message: msg,
		data: data
	};
	return res.status(200).json(resData);
};

function ErrorResponse (res, msg) {
	var data = {
		status: 500,
		version: version,
		message: msg,
	};
	return res.status(500).json(data);
};

function notFoundResponse (res, msg) {
	var data = {
		status: 404,
		version: version,
		message: msg,
	};
	return res.status(404).json(data);
};

function validationErrorWithData (res, msg, data) {
	var resData = {
		status: 400,
		version: version,
		message: msg,
		data: data
	};
	return res.status(400).json(resData);
};

function unauthorizedResponse (res, msg) {
	var data = {
		status: 401,
		version: version,
		message: msg,
	};
	return res.status(401).json(data);
};


// module.exports = successResponse, successResponseWithData, ErrorResponse, notFoundResponse, validationErrorWithData, unauthorizedResponse;
module.exports = {
    successResponse: successResponse,
    successResponseWithData: successResponseWithData,
    ErrorResponse: ErrorResponse,
    notFoundResponse: notFoundResponse,
    validationErrorWithData: validationErrorWithData,
    unauthorizedResponse: unauthorizedResponse
};