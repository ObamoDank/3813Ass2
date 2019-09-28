var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: String,
    password: String,
    email: String,
    role: String
});

var ChannelSchema = new Schema({
    name: String,
    access: Array,
    messages: Array
});

var GroupSchema = new Schema({
    name: String,
    admin: String,
    assis: Array,
    users: Array,
    channels: {
        type: [ChannelSchema],
        default: undefined
    }
});

module.exports = mongoose.model("User", UserSchema);
module.exports = mongoose.model("Group", GroupSchema);