//routes/category.routes
//models/category.model
//controller/shop.controller
const User = require("../Models/user.model");
const Product = require("../Models/product.model");
const Category = require("../Models/category.model");
module.exports = {
    ALL: async(req, res) => {
        let A = Category.find().lean().toJason();
        console.log(a);
        return A;
    },
    loadall: async(req, res) => {
        Category.find().lean().then((category) => {
            res.render("./Client/quicksearchcategory", {
                Category: category,
                ShopGrid: "active",
                User: req.user,
                Page: "Shop",
            });
        })
    },
    loadauthor: async(req, res) => {
        User.find().lean().then((users) => {
            res.render("./Client/quicksearchauthor", {
                users: users,
                UserGrid: "active",
                User: req.user,
                Page: "Shop",
            });
        })
    },
};