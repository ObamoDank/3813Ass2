const fs = require("fs")

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

// Module alters the role of specified user. If user is altered to become super user,
// user is removed from all groups and channels.

module.exports = function (app, path) {
    app.post("/promoteUser", function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let username = req.body.username;
        let newRole = req.body.role;

        console.log("Made it to Promote User.. Feel Free to relax..");
        fs.readFile("./data.json", "utf-8", function (err, data) {
            if (err) {
                throw err;
            }
            allData = JSON.parse(data)
            for (let i = 0; i < allData.users.length; i++) {
                if (username == allData.users[i].username) {
                    allData.users[i].role = newRole;
                }
            }
            if (newRole == 'super') {
                for (let i = 0; i < allData.groups.length; i++) {
                    if (allData.groups[i].admin == username) {
                        allData.groups[i].admin = "";
                    }
                    if (allData.groups[i].assis.includes(username)) {
                        remove(allData.groups[i].assis, username);
                    }
                    if (allData.groups[i].users.includes(username)) {
                        remove(allData.groups[i].users, username);
                    }
                    for (let j = 0; j < allData.groups[i].channels.length; j++) {
                        if (allData.groups[i].channels[j].access.includes(username)) {
                            remove(allData.groups[i].channels[j].access, username);
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