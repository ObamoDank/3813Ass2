const fs = require("fs");

// Function removes specified value from specified array

function remove(arr, user) {
    userExist = false;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == user) {
            arr.splice(i, 1);
            userExist = true;
        }
    }
}

// Module adds Admin to group. If user is already in group, user is removed from all arrays within
// group as admin needs only be displayed once.

module.exports = function (app, path) {
    app.post("/newAdmin", function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let user = req.body.username;
        let group = req.body.group;
        let groups = [];

        console.log(user);
        console.log(group);
        console.log("Made it to New Admin.. How's the scoopin?")
        fs.readFile("./data.json", "utf-8", function (err, data) {
            if (err) {
                throw err;
            }
            let allData = JSON.parse(data);
            for (let i = 0; i < allData.groups.length; i++) {
                if (allData.groups[i].name == group) {
                    allData.groups[i].admin = user;
                    if (allData.groups[i].users.includes(user) || allData.groups[i].users.includes(user)) {
                        for (let j = 0; j < allData.groups[i].channels.length; j++) {
                            if (allData.groups[i].channels[j].access.includes(user)) {
                                remove(allData.groups[i].channels[j].access, user);
                            }
                        }
                        if (allData.groups[i].users.includes(user)) {
                            remove(allData.groups[i].users, user);
                        }
                        if (allData.groups[i].assis.includes(user)) {
                            remove(allData.groups[i].assis, user);
                        }
                    }
                }
            }
            groups = allData.groups;
            let allDataJson = JSON.stringify(allData);
            fs.writeFile("./data.json", allDataJson, "utf-8", function (err) {
                if (err) {
                    throw err;
                }
            });
            res.send(groups);
        });
    });
}