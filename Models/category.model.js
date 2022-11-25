const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;
const categorySchema = new Schema(
	{
        name: String,
        imgPath : String,
        description :String
	}
);
categorySchema.plugin(mongoosePaginate);
const Category = mongoose.models.categories || mongoose.model("categories", categorySchema);
module.exports = Category;