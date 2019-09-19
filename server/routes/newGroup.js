const fs = require("fs");

// Module creates new group after checking to see if group already exists.

module.exports = function (app, path) {
    app.post("/newGroup", function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let newGroup = {
            "name": req.body.groupName,
            "admin": req.body.groupAdmin,
            "assis": [],
            "users": [],
            "channels": []
        }
        let groupExists = false;
        let groups = [];

        console.log("Made it to Create Groups.. Make yourself at home..");
        fs.readFile("./data.json", "utf-8", function (err, data) {
            if (err) {
                throw err;
            }
            let allData = JSON.parse(data);
            for (let i = 0; i < allData.groups.length; i++) {
                if (allData.groups[i].name == newGroup.name) {
                    groupExists = true;
                }
            }
            if (!groupExists) {
                allData.groups.push(newGroup);
                let allDataJson = JSON.stringify(allData);
                groups = allData.groups;
                fs.writeFile("./data.json", allDataJson, "utf-8", function (err) {
                    if (err) {
                        throw err;
                    }
                });
                res.send(groups);
            } else {
                res.send({ error: "Oy Group Exists ay Brah" });
            }
        });
    });
}