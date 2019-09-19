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

// Module Adds user to Assis array of group. If user is already within group, user is removed
// from all arrays as it is not necessary to be displayed multiple times.

module.exports = function (app, path) {
    app.post("/newAssis", function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let user = req.body.username;
        let group = req.body.group;

        console.log(user);
        console.log(group);
        console.log("Made it to New Assis.. How's the scoopin?")
        fs.readFile("./data.json", "utf-8", function (err, data) {
            if (err) {
                throw err;
            }
            let allData = JSON.parse(data);
            for (let i = 0; i < allData.users.length; i++) {
                if (allData.users[i].username == user) {
                    if (allData.users[i].role == 'user') {
                        allData.users[i].role = 'assis';
                    }
                }
            }
            for (let i = 0; i < allData.groups.length; i++) {
                if (allData.groups[i].name == group) {
                    allData.groups[i].assis.push(user);
                    remove(allData.groups[i].users, user);
                    for (let j = 0; j < allData.groups[i].channels.length; j++) {
                        if (allData.groups[i].channels[j].access.includes(user)) {
                            remove(allData.groups[i].channels[j].access, user);
                        }
                    }
                }
            }
            let allDataJson = JSON.stringify(allData);
            fs.writeFile("./data.json", allDataJson, "utf-8", function (err) {
                if (err) {
                    throw err;
                }
            });
            res.send(allData);
        });
    });
}