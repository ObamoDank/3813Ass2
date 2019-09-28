// Module accesses database and removes specified channel

module.exports = function (app, db) {
    app.post("/destroyChannel", async function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let channel = req.body.channelName;
        let group = req.body.channelGroup;

        console.log("Made it to Destroy Channel.. Welcome Sir, Would You like a Bagel..?");
        const channelData = db.collection("channels");
        const messageData = db.collection("messages");
        console.log(channel);
        console.log(group);
        await channelData.deleteOne({"name": channel, "group": group});
        await messageData.deleteMany({"channel": channel});
        res.send({msg: "Channel Destroyed"});
    });
}