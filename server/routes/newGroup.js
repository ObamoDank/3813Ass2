// Module creates new group after checking to see if group already exists.

module.exports = function (app, db) {
    app.post("/newGroup", function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        let newGroup = {
            "name": req.body.groupName,
            "admin": req.body.groupAdmin,
            "assis": [],
            "users": []
        }
        let groupExists = false;

        console.log("Made it to Create Groups.. Make yourself at home..");
        const groupData = db.collection("groups");
        groupData.find({}).toArray(async (err, groups) => {
            for (let i = 0; i < groups.length; i++) {
                if (groups[i].name == newGroup.name) {
                    groupExists = true;
                }
            }
            if (!groupExists) {
                await groupData.insertOne(newGroup);
                res.send({msg: "New Group Created "});
            }
            else {
                res.send({ error: "User exists breh" });
            }
        });
    });
}