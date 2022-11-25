const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;
const myclassSchema = new Schema(
	{
        iduser: String,
        idcourses: [],
	},
	{
		timestamps: true,
	}
);
myclassSchema.plugin(mongoosePaginate);
const Class = mongoose.models.Classes || mongoose.model("classes", myclassSchema);
module.exports = Class;