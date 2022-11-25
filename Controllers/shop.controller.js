//routes/category.routes
//models/category.model
//controller/shop.controller
const User = require("../Models/user.model");
const Product = require("../Models/product.model");
const Category = require("../Models/category.model");
const { count } = require("../Models/user.model");
module.exports = {
    loadall: async(req, res) => {
        Category.find()
            .lean()
            .then((categoryList) => {
                Product.find({ check: 1 }, {}, { limit: 8 })
                    .sort({ createdAt: -1 })
                    .lean()
                    .then((productList) => {
                        Product.countDocuments().then((count) => {
                            Product.find({ check: 1 }).sort({ rating: -1 }).lean().then((toprating) => {
                                res.render("./Client/index", {
                                    Category: categoryList,
                                    Product: productList,
                                    Count: count,
                                    toprating: toprating,
                                    User: req.user,
                                    Page: "Home"
                                });
                            })

                        });
                    });
            })
            .catch((err) => console.log(err));
    },
    registerteacher: async(req, res, idUser) => {
        User.findByIdAndUpdate(idUser, { role: 2 }, function(err, result) {});
        User.findOne(idUser).lean().then((a) => { console.log(a) });
        res.render('./Client/registerteacher', {
            User: req.user,
            Page: "Teacher",
        });
    },
};