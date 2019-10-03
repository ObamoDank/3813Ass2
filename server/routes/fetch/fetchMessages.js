// Module returns an array containing all user objects

module.exports = function (app, db) {
    app.post("/fetchMessages", function (req, res) {
        if (!req.body) {
            return res.sendstatus(400);
        }

        console.log("Made it to Fetch Messages.. You're branching far..");
        const messageData = db.collection("messages");
        messageData.find({}).toArray((err, messages) => {
            res.send(messages);
        })
    });
}