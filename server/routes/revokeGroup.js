const fs = require("fs");

// Function removes specified user from specified array

function remove(arr, user) {
    userExist = false;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == user) {
            arr.splice(i, 1);
            userExist = true;
        }
    }
    console.log(userExist);
}

// Function removes specified user from specified group

module.exports = function (app, path) {
    app.post("/revokeGroup", function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let group = req.body.groupName;
        let user = req.body.username;
        let groups = [];

        console.log("Made it to Revoke Groups.. Howdy Stranger, Welcome..");
        fs.readFile("./data.json", "utf-8", function (err, data) {
            if (err) {
                throw err;
            }
            let allData = JSON.parse(data);
            for (let i = 0; i < allData.groups.length; i++) {
                if (allData.groups[i].name == group) {
                    remove(allData.groups[i].users, user);
                    remove(allData.groups[i].assis, user);
                    if (allData.groups[i].admin == user) {
                        allData.groups[i].admin = "";
                        console.log("Oath Cunt");
                    }
                    for (let j = 0; j < allData.groups[i].channels.length; j++) {
                        remove(allData.groups[i].channels[j].access, user);
                    }
                }
            }
            let allDataJson = JSON.stringify(allData);
            groups = allData.groups;
            fs.writeFile("./data.json", allDataJson, "utf-8", function (err) {
                if (err) {
                    throw err;
                }
            });
            res.send(groups);
        });
    });
}