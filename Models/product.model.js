const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;
const productSchema = new Schema({
    name: String,
    category: {
        id: String,
        name: String
    },
    descriptionshort: String,
    descriptionfull: String,
    author: {
        id: String,
        name: String
    },
    price: Number,
    pathImg: String,
    sold: {
        type: Number,
        default: 0,
    },
    video: Array,
    comment: [{
        iduser: String,
        name: String,
        com: String,
    }],
    discount: {
        type: Number,
        default: 0,
    },
    rating: {
        type: Number,
        default: 0,
    },
    check: {
        type: Number,
        default: 0,
    }

}, {
    timestamps: true,
});
productSchema.plugin(mongoosePaginate);
const Product = mongoose.models.Products || mongoose.model("Products", productSchema);
module.exports = Product;