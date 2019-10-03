// Module Deletes specified group from database

module.exports = function (app, db) {
    app.post("/destroyGroup", async function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let group = req.body.name;

        console.log("Made it to Destroy Groups.. Have a glass, on the house..");
        const channelData = db.collection("channels");
        const groupData = db.collection("groups");
        const messageData = db.collection("messages");
        await groupData.deleteOne({ "name": group });
        await channelData.deleteMany({ "group": group });
        await messageData.deleteMany({ "group": group });
        res.send({ msg: "Group Destroyed" });
    });
}