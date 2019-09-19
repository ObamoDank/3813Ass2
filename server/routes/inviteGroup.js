const fs = require("fs");

// Module adds specified user to specified group

module.exports = function (app, path) {
    app.post("/inviteGroup", function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let group = req.body.groupName;
        let user = req.body.username;
        let role = req.body.role;
        let groups = [];

        console.log("Made it to Invite Groups.. Oceans to the East, Mountain to the West..");
        fs.readFile("./data.json", "utf-8", function (err, data) {
            if (err) {
                throw err;
            }
            let allData = JSON.parse(data);
            for (let i = 0; i < allData.groups.length; i++) {
                if (allData.groups[i].name == group) {
                    if (role == 'user') {
                        allData.groups[i].users.push(user);
                    }
                    if (role == 'assis') {
                        allData.groups[i].assis.push(user);
                    }
                    if (role == 'admin') {
                        allData.groups[i].admin = user;
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