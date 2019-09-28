// Module alters the role of specified user. If user is altered to become super user,
// user is removed from all groups and channels.

module.exports = function (app, db) {
    app.post("/promoteUser", async function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let username = req.body.username;
        let newRole = req.body.role;

        console.log("Made it to Promote User.. Feel Free to relax..");
        let userData = db.collection("users");
        let groupData = db.collection("groups");
        let channelData = db.collection("channels");
        await userData.updateOne({"username": username}, {$set: {"role": newRole}});
        if(newRole == "super"){
            await groupData.updateMany({}, {$pull: {assis: username, users: username}});
            await groupData.updateMany({admin: username}, {$set: {admin: ""}});
            await channelData.updateMany({}, {$pull: {access: username}})
        }
        res.send({msg: username + " Promoted"})
    });
}