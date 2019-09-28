// Module returns list of all groups in database

module.exports = function (app, db) {
    app.post("/fetchGroups", function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }
        msg = req.body.message;
        count = 0;

        console.log("Made it to Fetch Groups.. Put your feet up..")
        console.log(msg);
        let groupData = db.collection("groups");
        let channelData = db.collection("channels");
        groupData.find({}).toArray((err, groups) => {
            for (let i = 0; i < groups.length; i++) {
                groups[i].channels = [];
                channelData.find({}).toArray((err, channels) => {
                    for (let j = 0; j < channels.length; j++) {
                        if (groups[i].name == channels[j].group) {
                            groups[i].channels.push(channels[j]);
                        }
                    }
                    count++;
                    if (count == groups.length) {
                        res.send(groups);
                    }
                });
            }
        });
    });
}
