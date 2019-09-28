// Module adds specified user to specified channel within specified group.

module.exports = function (app, db) {
    app.post("/inviteChannel", async function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let group = req.body.groupName;
        let channel = req.body.channelName;
        let user = req.body.username;

        console.log("Made it to Invite Groups.. Yeeeeeep..");
        const groupData = db.collection("groups");
        const channelData = db.collection("channels");
        await channelData.updateOne({ name: channel, "group": group }, { $push: { access: user } });
        groupData.find({ name: group }).toArray(async (err, groups) => {
            if (!groups[0].users.includes(user)) {
                console.log("User isn't in group yet");
                await groupData.updateOne({ name: group }, { $push: { users: user } });
                res.send({ msg: user + " Added To " + channel });
            } else {
                console.log("User already in group");
                res.send({ msg: user + " Added To " + channel });
            }
        });
    });
}