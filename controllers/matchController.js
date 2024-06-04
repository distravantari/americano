
const response = require("../response/apiresponse.js");
const Matches = require("../dbmodels/matchmodel.js");

/**
 * Match List.
 * 
 * @returns {Object}
 */
const list = [
	function (req, res) {
		try {
			Matches.find({}).then((match)=>{
				if(match.length > 0){
					return response.successResponseWithData(res, "successfully get all account", match);
				}else{
					return response.successResponseWithData(res, "No match's acquire", []);
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			console.log("error getting match list", err);
			return response.ErrorResponse(res, err);
		}
	}
];

/**
 * Account.
 * @param {string}      id
 * 
 * @returns {Object}
 */
const detail = [
    // auth,
    function (req, res) {
        try {
           details(req.params.id).then((config) => {
               if(config !== null){
                   return response.successResponseWithData(res, `successfully get ${config.accountID}`, config);
               }else{
                   return response.successResponseWithData(res, "No match's acquire", []);
               }
           });
        } catch (err) {
            //throw error in json response with status 500. 
            return response.ErrorResponse(res, err);
        }
    }
];

/**
 * Account.
 * 
 * @returns {Object}
 */
const add = [
	// auth,
	function (req, res) {
		try {
			var accountID = req.body.accountID
			details(accountID).then((config) => {
				if(config !== null){
					// update account.
					Account.deleteMany({ accountID:config.accountID } ,function (err, result) {
						if (err) { 
							return response.ErrorResponse(res, err); 
						}else{
							var account = new Account(
								req.body
							);
							account.save(function (err) {
								if (err) { return response.ErrorResponse(res, err); }
								else {
									return response.successResponseWithData(res, `successfully register new account as ${accountID}`, registered(accountID, req, ""));
								}
							});
						}
					});
				}else{
					var account = new Account(
						req.body
					);
					account.save(function (err) {
						if (err) { return response.ErrorResponse(res, err); }
						return response.successResponseWithData(res, `successfully register new match as ${accountID}`, req.body);
					});
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return response.ErrorResponse(res, err);
		}
	}
];

async function details(id){
	var config = await Matches.findOne({ accountID: id })
	return await Promise.resolve(config);
}

module.exports = {
    list: list,
    detail: detail,
    add: add
};

