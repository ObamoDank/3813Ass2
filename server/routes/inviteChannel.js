const fs = require("fs");

// Module adds specified user to specified channel within specified group.

module.exports = function (app, path) {
    app.post("/inviteChannel", function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let group = req.body.groupName;
        let channel = req.body.channelName;
        let user = req.body.username;
        let groups = [];

        console.log("Made it to Invite Groups.. Yeeeeeep..");
        fs.readFile("./data.json", "utf-8", function (err, data) {
            if (err) {
                throw err;
            }
            let allData = JSON.parse(data);
            for (let i = 0; i < allData.groups.length; i++) {
                if (allData.groups[i].name == group) {
                    if (!allData.groups[i].users.includes(user)) {
                        allData.groups[i].users.push(user);
                    }
                    for (let j = 0; j < allData.groups[i].channels.length; j++) {
                        if (allData.groups[i].channels[j].name == channel) {
                            allData.groups[i].channels[j].access.push(user);
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