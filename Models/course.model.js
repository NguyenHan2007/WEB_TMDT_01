const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;
const mycourseSchema = new Schema(
	{
        iduser: String,
        idproducts: [],
	},
	{
		timestamps: true,
	}
);
mycourseSchema.plugin(mongoosePaginate);
const Course = mongoose.models.Courses || mongoose.model("courses", mycourseSchema);
module.exports = Course;