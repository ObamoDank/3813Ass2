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
        socketChannels = [];

        io.on("connection", (socket) => {
            console.log("user connection on: " + socket.id);

            // Function recieves and emits message before adding to database
            socket.on("message", async (messageObj) => {
                for (i = 0; i < socketRoom.length; i++) {
                    if (socketRoom[i][0] == socket.id) {
                        io.to(socketRoom[i][1]).emit('message', message);
                    }
                }
                await messageData.insertOne(messageObj);
                console.log(socketRoom);
                console.log(socketRoomNum);
            });

            socket.on("joinRoom", function (room) {
                socket.join(room, function () {
                    console.log(socketRoom);
                    console.log(socketRoomNum);
                    let inRoomSocketArray = false;

                    for (let i = 0; i < socketRoom.length; i++) {
                        if (socketRoom[i][0] == socket.id) {
                            socketRoom[i][1] = room;
                            inRoomSocketArray = true;
                        }
                    }
                    console.log(socketRoom);
                    console.log(socketRoomNum);
                    if (inRoomSocketArray == false) {
                        //add socket id/room record
                        socketRoom.push([socket.id, room]);
                        let hasRoomNum = false;
                        //recalculate number of users in a room
                        for (let j = 0; j < socketRoomNum.length; j++) {
                            if (socketRoomNum[j][0] == room) {
                                socketRoomNum[j][1] = socketRoomNum[j][1] + 1;
                                hasRoomNum = true;
                            }
                        }
                        console.log(socketRoom);
                        console.log(socketRoomNum);
                        // start tracking number of users in a room if it has not yet been done
                        if (hasRoomNum == false) {
                            socketRoomNum.push([room, 1]);
                        }
                    }
                    io.in(room).emit("notice", "A new user has joined");
                });
                console.log(socketRoom);
                console.log(socketRoomNum);
                return io.in(room).emit('joined', room);
            });
        });
    }
}