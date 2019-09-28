// Module adds specified user to specified group

module.exports = function (app, db) {
    app.post("/inviteGroup", async function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let group = req.body.groupName;
        let user = req.body.username;
        let role = req.body.role;

        let groupData = db.collection("groups");
        if (role == 'user') {
            await groupData.updateOne({name: group}, {$push: {users: user}});
        }
        if (role == 'assis') {
            await groupData.updateOne({name: group}, {$push: {assis: user}});
        }
        if (role == 'admin') {
            await groupData.updateOne({name: group}, {$set: {admin: user}});
        }
        res.send({msg: user + " Added to " + group});
    });
}