const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;
const cartSchema = new Schema(
	{
        iduser: String,
        idproducts: [],
		totalprice: {
			type: Number,
			default: 0,
		}
	},
	{
		timestamps: true,
	}
);
cartSchema.plugin(mongoosePaginate);
const Cart = mongoose.models.Carts || mongoose.model("Carts", cartSchema);
module.exports = Cart;