// Module adds Admin to group. If user is already in group, user is removed from all arrays within
// group as admin needs only be displayed once.

module.exports = function (app, db) {
    app.post("/newAdmin", async function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let user = req.body.username;
        let group = req.body.group;

        console.log("Made it to New Admin.. How's the scoopin?")
        const groupData = db.collection("groups");
        const channelData = db.collection("channels");
        await groupData.update({name: group}, {$set: {admin: user}});
        await groupData.update({name: group}, {$pull: {users: user, assis: user}});
        await channelData.update({"group": group}, {$pull: {access: user}});
        res.send({msg: user + " Promoted to Admin of " + group});
    });
}