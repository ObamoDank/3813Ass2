const fs = require("fs");

// Module adds specified channel to specified group. First checks to see if channel
// already exists.

module.exports = function (app, path) {
    app.post("/newChannel", function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let newChannel = {
            "name": req.body.channelName,
            "access": []
        }
        let channelExists = false;
        let group = req.body.channelGroup;
        let groups = [];

        console.log("Made it to Create Channel..Ice cold..");
        fs.readFile("./data.json", "utf-8", function (err, data) {
            if (err) {
                throw err;
            }
            let allData = JSON.parse(data);
            for (let i = 0; i < allData.groups.length; i++) {
                if (allData.groups[i].name == group) {
                    for (let j = 0; j < allData.groups[i].channels.length; j++) {
                        if (allData.groups[i].channels[j].name == newChannel.name) {
                            channelExists = true;
                        }
                    }
                    if (!channelExists) {
                        allData.groups[i].channels.push(newChannel);
                    } else {
                        return res.send({ error: "Oy Channel Exists ay Brah" });
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