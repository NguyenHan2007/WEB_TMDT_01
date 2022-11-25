const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    displayname: String,
    phonenumber: String,
    address: String,
    birthday: Date,
    avatar: String,
    role: {
        type: Number,
        default: 1,
    },
}, {
    timestamps: true,
});
userSchema.plugin(mongoosePaginate);
const User = mongoose.models.Users || mongoose.model("Users", userSchema);
module.exports = User;