module.exports = {
    connect: async function (app, io, db) {
        // Start Sockets
        const messageData = db.collection("messages");
        const channelData = db.collection("channels");
        let channels = [];
        let messages = [];
        await channelData.find({}).toArray((err, channelDB) => {
            channels = channelDB;
        })
        await messageData.find({}).toArray((err, messageDB) => {
            messages = messageDB;
        })
        whoIsWhere = [];

        io.on("connection", (socket) => {
            console.log("user connection on: " + socket.id);

            // Function recieves and emits message before adding to database
            socket.on("message", (messageObj, location) => {
                io.emit('message', messageObj);

                // for (i = 0; i < whoIsWhere.length; i++) {
                //     if (whoIsWhere[i].id == socket.id) {
                //         io.to(location.channel).emit('message', messageObj);
                //     }
                // }
                
                messageData.insertOne(messageObj);
            });

            socket.on("joinRoom", function (room, user) {
                socket.join(room.channel, function () {
                    let inChannelArray = false;
                    console.log(user);
                    for (let i = 0; i < whoIsWhere.length; i++) {
                        if (whoIsWhere[i].id == socket.id) {
                            whoIsWhere[i].group = room.group;
                            whoIsWhere[i].channel = room.channel;
                            inChannelArray = true;
                        }
                    }
                    if (inChannelArray == false) {
                        //add socket id/room record
                        whoIsWhere.push({
                            id: socket.id,
                            group: room.group,
                            channel: room.channel,
                        });
                    }

                    io.to(room.channel).emit("notice", user + " has joined");
                });
            });

            socket.on("leaveRoom", function (room, user) {
                for (let i = 0; i < whoIsWhere.length; i++) {
                    if (whoIsWhere[i].id == socket.id) {
                        console.log(room);
                        whoIsWhere.splice(i, 1);
                        console.log(whoIsWhere);
                        socket.leave(room.channel);
                        io.to(room.channel).emit("notice", user + " has left");
                    }
                }
            });

            socket.on('disconnect', function () {
                io.emit('disconnect');
                for (let i = 0; i < whoIsWhere.length; i++) {
                    if (whoIsWhere[i].id == socket.id) {
                        whoIsWhere.splice(i, 1);
                    }
                }
                io.emit("notice", "A User has disconnected from server... You could be next");
                console.log("Client Disconnected");
                console.log(whoIsWhere);
            });
        });
    }
}