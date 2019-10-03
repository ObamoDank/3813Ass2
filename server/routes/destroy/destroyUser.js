// Module removes specified value from database

module.exports = function (app, db) {
    app.post("/destroyUser", async function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let username = req.body.username;

        console.log("Made it to Destroy User... Kick back..");
        const userData = db.collection("users");
        const groupData = db.collection("groups");
        const channelData = db.collection("channels");
        await userData.deleteOne({'username': username});
        await groupData.updateMany({admin: username}, {$set: {admin: ""}});
        await groupData.updateMany({assis: username}, {$pull: {assis: username}});
        await groupData.updateMany({users: username}, {$pull: {users: username}});
        await channelData.updateMany({access: username}, {$pull: {access: username}});
        res.send({msg: "User Destroyed"});
    });
}