// Function removes specified user from specified channel.

module.exports = function (app, db) {
    app.post("/revokeChannel", async function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let group = req.body.groupName;
        let channel = req.body.channelName;
        let user = req.body.username;

        console.log("Made it to Revoke Channels.. Yeeeeeep..");
        const channelData = db.collection("channels");
        await channelData.updateOne({name: channel, "group": group}, {$pull: {access: user}});
        res.send({msg: user + " Removed From " + channel});
    });
}