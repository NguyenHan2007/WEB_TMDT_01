//routes/category.routes
//models/category.model
//controller/shop.controller
const User = require("../Models/user.model");
const Product = require("../Models/product.model");
const Category = require("../Models/category.model");

module.exports = {
    // danh sach product
    loadall: async(req, res, pageNum, sort) => {
        //add and update field MongoDB Product
        // Product.updateMany({}, {
        //         $set: {
        //             "author.id": "5f3797befac3bc1b0c0ddafd",
        //             "author.name": "Gin",
        //             pathImg: "/img/product/ImgShow/product1.png",
        //             sold: 20,
        //             "author.id": "id08",
        //             rating: 8.2,
        //             comment: [{
        //                     iduser: "5f36aab31293a30017bbaf05",
        //                     name: "GinAce",
        //                     com: "Ok! so good! "
        //                 },
        //                 {
        //                     iduser: "5f36c47a236f8c31b887fa63",
        //                     name: "Nguyễn Thị Ngọc Hân",
        //                     com: "great! "
        //                 },
        //                 {
        //                     iduser: "5f37852ccfa3b70017c9acd0",
        //                     name: "minh anh",
        //                     com: "thanks!"
        //                 }
        //             ],
        //         }
        //     }, { new: true },
        //     (err, doc) => {
        //         if (err) {
        //             console.log("Something wrong when updating data!");
        //         }

        //         console.log("Update successful!");
        //     });
        let key = 1;
        //Kiem tra sap xep thu tu tang dan hay giam dan
        if (sort == "PriceDescending" || sort == "LengthDescending") key = -1;
        //var options = {};
        var options = {
            page: pageNum,
            limit: 9,
            lean: true,
            sort: { price: key },
        };
        //Xu ly sap xem theo price
        if (sort == "PriceAscending" || sort == "PriceDescending") {}
        //Xu ly sap xem theo name
        if (sort == "LengthAscending" || sort == "LengthDescending") {
            options = {
                page: pageNum,
                limit: 9,
                lean: true,
                sort: { name: key },
            };
        }
        Category.find()
            .lean()
            .then((listCategory) => {
                // lay thong tin category
                Product.find({ check: 1 })
                    .countDocuments()
                    .lean()
                    .then((Count) => {
                        Product.find({ check: 1 }).sort({ sold: 1 }).limit(8).lean().then((topsale) => {
                            Product.paginate({ check: 1 }, options, function(err, result) {
                                // lay danh sach product va sap xem theo options
                                res.render("./Client/shop-grid product test", {
                                    totalpages: result.totalPages,
                                    prev: result.prevPage,
                                    now: result.page,
                                    next: result.nextPage,
                                    list: result.docs,
                                    Product: result.docs,
                                    Category: listCategory,
                                    AllCategory: listCategory,
                                    Count: Count,
                                    topsale: topsale,
                                    ShopGrid: "active",
                                    User: req.user,
                                    Page: "Shop",
                                });
                            });
                        })

                    })
                    .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    },
    // lay product theo id
    loadId: async(req, res, id) => {
        Product.findById(id)
            .sort({ price: 1 })
            .lean()
            .then((productList) => {
                // xuat product theo id
                Category.find({ "name": productList.category.name })
                    .lean()
                    .then((categoryList) => {
                        // lay thong tin category cua producct
                        Category.find({})
                            .sort({ name: 1 })
                            .lean()
                            .then((AllCategory) => {
                                Product.find({
                                        "category.name": productList.category.name,
                                        check: 1
                                    })
                                    .limit(5)
                                    .lean()
                                    .then((productRelated) => {
                                        Product.find({
                                            check: 1
                                        }).sort({ sold: 1 }).limit(8).lean().then((topsale) => {
                                            res.render("./Client/shop-details product test", {
                                                Product: productList,
                                                Category: categoryList,
                                                AllCategory: AllCategory,
                                                ShopGrid: "active",
                                                User: req.user,
                                                topsale: topsale,
                                                productRelated: productRelated,
                                                Page: "Product details",
                                            });
                                        })
                                    });
                            })
                            .catch((err) => console.log(err));
                    })
                    .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    },
    // seach by name product
    loadSearchByNameProduct: async(req, res, query, pageNum, sort) => {
        let key = 1;
        //Kiem tra sap xep thu tu tang dan hay giam dan
        if (sort == "PriceDescending" || sort == "LengthDescending") key = -1;
        //var options = {};
        var options = {
            page: pageNum,
            limit: 9,
            lean: true,
            sort: { price: key },
        };
        //Xu ly sap xem theo price
        if (sort == "PriceAscending" || sort == "PriceDescending") {}
        //Xu ly sap xem theo name
        if (sort == "LengthAscending" || sort == "LengthDescending") {
            options = {
                page: pageNum,
                limit: 9,
                lean: true,
                sort: { name: key },
            };
        }
        Category.find()
            .lean()
            .then((listCategory) => {
                //console.log('query search= '+ query);
                //console.log("search name product query" + query);
                Product.find({ name: { $regex: query, $options: "i" }, check: 1 })
                    .countDocuments()
                    .lean()
                    .then((Count) => {
                        Product.find({ check: 1 }).sort({ sold: 1 }).limit(8).lean().then((topsale) => {
                            Product.paginate({ name: { $regex: query, $options: "i" }, check: 1 },
                                options,
                                function(err, result) {
                                    res.render("./Client/shop-grid product test", {
                                        product: "active",
                                        totalpages: result.totalPages,
                                        prev: result.prevPage,
                                        now: result.page,
                                        next: result.nextPage,
                                        list: result.docs,
                                        Product: result.docs,
                                        Category: listCategory,
                                        AllCategory: listCategory,
                                        Count: Count,
                                        ShopGrid: "active",
                                        User: req.user,
                                        topsale: topsale,
                                        querySearch: query,
                                        Page: "Shop",
                                    });
                                }
                            );
                        })
                    })
                    .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    },
    // seach by name category
    loadSearchByNameCategory: async(req, res, query, pageNum, sort) => {
        let key = 1;
        //Kiem tra sap xep thu tu tang dan hay giam dan
        if (sort == "PriceDescending" || sort == "LengthDescending") key = -1;
        //var options = {};
        var options = {
            page: pageNum,
            limit: 9,
            lean: true,
            sort: { price: key },
        };
        //Xu ly sap xem theo price
        if (sort == "PriceAscending" || sort == "PriceDescending") {}
        //Xu ly sap xem theo name
        if (sort == "LengthAscending" || sort == "LengthDescending") {
            options = {
                page: pageNum,
                limit: 9,
                lean: true,
                sort: { name: key },
            };
        }
        Category.find()
            .lean()
            .then((listCategory) => {
                //console.log("search Category query" + query);
                Product.find({
                        "category.name": { $regex: query, $options: "i" },
                        check: 1,
                    })
                    .countDocuments()
                    .lean()
                    .then((Count) => {
                        Product.find({ check: 1 }).sort({ sold: 1 }).limit(8).lean().then((topsale) => {
                            Product.paginate({ "category.name": { $regex: query, $options: "i" }, check: 1 },
                                options,
                                function(err, result) {
                                    res.render("./Client/shop-grid product test", {
                                        product: "active",
                                        totalpages: result.totalPages,
                                        prev: result.prevPage,
                                        now: result.page,
                                        next: result.nextPage,
                                        list: result.docs,
                                        Product: result.docs,
                                        Category: listCategory,
                                        AllCategory: listCategory,
                                        Count: Count,
                                        topsale: topsale,
                                        ShopGrid: "active",
                                        querySearch: query,
                                        Page: "Shop",
                                    });
                                }
                            );
                        })
                    })
                    .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    },
    // seach by name price
    loadSearchByPrice: async(req, res, query, pageNum, sort) => {
        let key = 1;
        //Kiem tra sap xep thu tu tang dan hay giam dan
        if (sort == "PriceDescending" || sort == "LengthDescending") key = -1;
        //var options = {};
        var options = {
            page: pageNum,
            limit: 9,
            lean: true,
            sort: { price: key },
        };
        //Xu ly sap xem theo price
        if (sort == "PriceAscending" || sort == "PriceDescending") {}
        //Xu ly sap xem theo name
        if (sort == "LengthAscending" || sort == "LengthDescending") {
            options = {
                page: pageNum,
                limit: 9,
                lean: true,
                sort: { name: key },
            };
        }
        Category.find()
            .lean()
            .then((listCategory) => {
                //console.log("search Category query" + query);
                Product.find({
                        price: query,
                        check: 1,
                    })
                    .countDocuments()
                    .lean()
                    .then((Count) => {
                        Product.find({ check: 1 }).sort({ sold: 1 }).limit(8).lean().then((topsale) => {
                            Product.paginate({ price: query, check: 1 }, options, function(
                                err,
                                result
                            ) {
                                res.render("./Client/shop-grid product test", {
                                    product: "active",
                                    totalpages: result.totalPages,
                                    prev: result.prevPage,
                                    now: result.page,
                                    next: result.nextPage,
                                    list: result.docs,
                                    Product: result.docs,
                                    Category: listCategory,
                                    AllCategory: listCategory,
                                    ShopGrid: "active",
                                    Count: Count,
                                    topsale: topsale,
                                    querySearch: query,
                                    Page: "Shop",
                                });
                            });
                        })

                    })
                    .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    },
    // seach by name author
    loadSearchByNameAuthor: async(req, res, query, pageNum, sort) => {
        let key = 1;
        //Kiem tra sap xep thu tu tang dan hay giam dan
        if (sort == "PriceDescending" || sort == "LengthDescending") key = -1;
        //var options = {};
        var options = {
            page: pageNum,
            limit: 9,
            lean: true,
            sort: { price: key },
        };
        //Xu ly sap xem theo price
        if (sort == "PriceAscending" || sort == "PriceDescending") {}
        //Xu ly sap xem theo name
        if (sort == "LengthAscending" || sort == "LengthDescending") {
            options = {
                page: pageNum,
                limit: 9,
                lean: true,
                sort: { name: key },
            };
        }
        Category.find()
            .lean()
            .then((listCategory) => {
                //console.log("search Category query" + query);
                Product.find({
                        "author.name": { $regex: query, $options: "i" },
                        check: 1,
                    })
                    .countDocuments()
                    .lean()
                    .then((Count) => {
                        Product.find({ check: 1 }).sort({ sold: 1 }).limit(8).lean().then((topsale) => {
                            Product.paginate({ "author.name": { $regex: query, $options: "i" }, check: 1 },
                                options,
                                function(err, result) {
                                    res.render("./Client/shop-grid product test", {
                                        product: "active",
                                        totalpages: result.totalPages,
                                        prev: result.prevPage,
                                        now: result.page,
                                        next: result.nextPage,
                                        list: result.docs,
                                        Product: result.docs,
                                        Category: listCategory,
                                        AllCategory: listCategory,
                                        ShopGrid: "active",
                                        Count: Count,
                                        topsale: topsale,
                                        querySearch: query,
                                        Page: "Shop",
                                    });
                                }
                            );
                        })

                    })
                    .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    },
};