// Function removes specified user from specified group

module.exports = function (app, db) {
    app.post("/revokeGroup", async function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let group = req.body.groupName;
        let user = req.body.username;

        console.log("Made it to Revoke Groups.. Howdy Stranger, Welcome..");
        const groupData = db.collection("groups");
        const channelData = db.collection("channels");
        await groupData.updateOne({ name: group }, { $pull: { users: user, assis: user } });
        await groupData.updateOne({ name: group, admin: user }, { $set: { admin: "" } });
        await channelData.updateMany({ "group": group }, { $pull: { access: user } });
        res.send({msg: user + " Removed From " + group});
    });
}