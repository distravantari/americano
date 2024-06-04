
const express = require("express");
var router = express.Router();

const account = require("../controllers/matchController.js");

const response = require("../response/apiresponse.js");
const algorithm = require("../data/algorithm.json");

router.get("/ping", (req, res) => {
    return response.successResponse(res, "API are connected, please make sure you hit the current version");
})

router.get("/match", (req, res) => {  
    const match = {};

    // Split the playerNames string into an array
    const namesArray = req.query.playerNames.split(',');

    // Map over the namesArray to construct the rowData array
    const rowData = namesArray.map((name, index) => {
        // Increment index by 1 to start from 1 instead of 0
        return [index+1, name, 0, 0, 0];
    });
    match.standing = rowData;

    // Filter the array to get objects with id = 4
    const id4Data = algorithm.filter(item => item.id === rowData.length);
    match.rounds = id4Data;
    match.name = req.query.gameName;
    match.maxScore = req.query.gameof;
    // console.log(req.query.gameName);

    return response.successResponseWithData(res, "/match created", match);
})

router.post("/updatetable", (req, res) =>{
    // console.log("/updatetable are called", req.body);
    var str = req.body.round;
    var arr = str.split(",");
    var newStandings = [];
    console.log(arr);
    newStandings = req.body.table

    const p1 = newStandings.find(subarray => subarray[0] === parseInt(arr[0])+1);
    const p2 = newStandings.find(subarray => subarray[0] === parseInt(arr[1])+1);
    const p3 = newStandings.find(subarray => subarray[0] === parseInt(arr[2])+1);
    const p4 = newStandings.find(subarray => subarray[0] === parseInt(arr[3])+1);

    // console.log(newStandings)
    
    console.log("p1",p1);
    console.log("p2",p2);
    console.log("p3",p3);
    console.log("p4",p4);

    // if (req.body.type == '-'){
    //     newStandings[arr[0]][5]--;
    //     newStandings[arr[1]][5]--;
    //     newStandings[arr[2]][6]--;
    //     newStandings[arr[3]][6]--;
    // }else {
    //     newStandings[arr[0]][5]++;
    //     newStandings[arr[1]][5]++;
    //     newStandings[arr[2]][6]++;
    //     newStandings[arr[3]][6]++;
    // }

    // // +-
    // newStandings[arr[0]][7]=newStandings[arr[0]][5]-newStandings[arr[0]][6];
    // newStandings[arr[1]][7]=newStandings[arr[1]][5]-newStandings[arr[1]][6];
    // newStandings[arr[2]][7]=newStandings[arr[2]][5]-newStandings[arr[2]][6];
    // newStandings[arr[3]][7]=newStandings[arr[3]][5]-newStandings[arr[3]][6];


    if (req.body.type == '-'){
        p1[2]--;
        p2[2]--;
        p3[3]--;
        p4[3]--;
    }else {
        p1[2]++;
        p2[2]++;
        p3[3]++;
        p4[3]++;
    }

    // +-
    p1[4]=p1[2]-p1[3];
    p2[4]=p2[2]-p2[3];
    p3[4]=p3[2]-p3[3];
    p4[4]=p4[2]-p4[3];

    newStandings.sort((a, b) => {
        // Rule 1: Sort based on the biggest value of array[2]
        if (a[2] !== b[2]) {
            return b[2] - a[2];
        }
        
        // Rule 2: If array[2] is the same, sort by the lowest value of array[3]
        if (a[3] !== b[3]) {
            return a[3] - b[3];
        }
    
        // Rule 3: If still the same, sort based on the biggest value of array[4]
        return b[4] - a[4];
    });

    return response.successResponseWithData(res, "new standings", newStandings);
})

router.get("/", account.list)
router.get("/:id", account.detail)
router.post("/", account.add)


module.exports = router;