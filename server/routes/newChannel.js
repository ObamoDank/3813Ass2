// Module adds specified channel to specified group. First checks to see if channel
// already exists.

module.exports = function (app, db) {
    app.post("/newChannel", function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let newChannel = {
            "name": req.body.channelName,
            "group": req.body.channelGroup,
            "access": []
        }
        let channelExists = false;

        console.log("Made it to Create Channel..Ice cold..");
        const channelData = db.collection("channels");
        channelData.find({}).toArray(async (err, channels) => {
            for (let i = 0; i < channels.length; i++) {
                if (channels[i].name == newChannel.name && channels[i].group == newChannel.group) {
                    channelExists = true;
                }
            }
            if (!channelExists) {
                await channelData.insertOne(newChannel);
                res.send({ msg: "New Channel Created" });
            }
            else {
                res.send({ error: "Channel exists breh" });
            }
        });
    });
}