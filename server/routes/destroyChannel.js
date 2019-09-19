const fs = require("fs");

// Module accesses database and removes specified channel

module.exports = function (app, path) {
    app.post("/destroyChannel", function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let group = req.body.channelGroup;
        let channel = req.body.channelName;
        let groups = []

        console.log("Made it to Destroy Channel.. Welcome Sir, Bong and a Bagel?..");
        fs.readFile("./data.json", "utf-8", function (err, data) {
            if (err) {
                throw err;
            }
            let allData = JSON.parse(data);
            for (let i = 0; i < allData.groups.length; i++) {
                if (allData.groups[i].name == group) {
                    for (let j = 0; j < allData.groups[i].channels.length; j++) {
                        if (allData.groups[i].channels[j].name == channel) {
                            allData.groups[i].channels.splice([j], 1);
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