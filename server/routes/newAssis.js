// Module Adds user to Assis array of group. If user is already within group, user is removed
// from all arrays as it is not necessary to be displayed multiple times.

module.exports = function (app, db) {
    app.post("/newAssis", async function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let user = req.body.username;
        let group = req.body.group;

        console.log("Made it to New Assis.. How's the scoopin?")
        const groupData = db.collection("groups");
        const channelData = db.collection("channels");
        await groupData.update({name: group}, {$push: {assis: user}});
        await groupData.update({name: group}, {$pull: {users: user}});
        await channelData.update({"group": group}, {$pull: {access: user}});
        res.send({msg: user + " Promoted to Admin of " + group});
    });
}