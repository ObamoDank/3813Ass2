const fs = require("fs");

// Function removes specified value from specified array.

function remove(arr, user) {
    userExist = false;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == user) {
            arr.splice(i, 1);
            userExist = true;
        }
    }
}

// Function removes specified user from specified channel.

module.exports = function (app, path) {
    app.post("/revokeChannel", function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let group = req.body.groupName;
        let channel = req.body.channelName;
        let user = req.body.username;
        let groups = [];

        console.log("Made it to Revoke Channels.. Yeeeeeep..");
        fs.readFile("./data.json", "utf-8", function (err, data) {
            if (err) {
                throw err;
            }
            let allData = JSON.parse(data);
            for (let i = 0; i < allData.groups.length; i++) {
                if (allData.groups[i].name == group) {
                    for (let j = 0; j < allData.groups[i].channels.length; j++) {
                        if (allData.groups[i].channels[j].name == channel) {
                            remove(allData.groups[i].channels[j].access, user);
                        }
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