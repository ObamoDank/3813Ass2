const fs = require("fs");

// Module Deletes specified group from database

module.exports = function (app, path) {
    app.post("/destroyGroup", function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let group = req.body.name;
        let groups = []

        console.log("Made it to Destroy Groups.. Have a glass, on the house..");
        fs.readFile("./data.json", "utf-8", function (err, data) {
            if (err) {
                throw err;
            }
            let allData = JSON.parse(data);
            for (let i = 0; i < allData.groups.length; i++) {
                if (allData.groups[i].name == group) {
                    allData.groups.splice([i], 1);
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