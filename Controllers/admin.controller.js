const User = require("../Models/user.model");
const Product = require("../Models/product.model");
const Bill = require("../Models/bill.model");
const Course = require("../Models/course.model");
const Class = require("../Models/class.model");
module.exports = {
    //user management
    LoadAllUser: async (req, res, pageNum) => {
        const options = {
            page: pageNum,
            limit: 10,
            lean: true,
        };
        User.paginate({}, options, function (err, result) {
            res.render('./Admin/client-management', {
                layout: 'admin',
                page: 'Quản lý khách hàng',
                client: 'active',
                totalpages: result.totalPages,
                prev: result.prevPage,
                now: result.page,
                next: result.nextPage,
                list: result.docs,
                User: req.user,
            });
        });
    },
    DeleteUser: async (req, res, id) => {
        User.findByIdAndDelete(id)
            .catch((err) => console.log(err));
    },
    UpgradeUser: async (req, res, id) => {
        User.findByIdAndUpdate(id, { role: 0 }, function (err, result) { })
            .then((Teacher) => {
                const newclass = new Class({
                    iduser: Teacher._id,
                    idcourses: [],
                });
                newclass.save()
                        .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    },

    //product management
    LoadAllProduct: async (req, res, pageNum) => {
        const options = {
            page: pageNum,
            limit: 5,
            lean: true,
        };
        Product.paginate({}, options, function (err, result) {
            res.render('./Admin/product-management', {
                layout: 'admin',
                page: 'Quản lý sản phẩm',
                product: 'active',
                totalpages: result.totalPages,
                prev: result.prevPage,
                now: result.page,
                next: result.nextPage,
                list: result.docs,
                User: req.user,
            });
        });
    },

    DeleteProduct: async (req, res, id) => {
        Product.findByIdAndDelete(id)
            .catch((err) => console.log(err));
    },

    UpgradeProduct: async (req, res, id) => {
        Product.findByIdAndUpdate(id, { check: 1 }, function (err, result) { })
            .catch((err) => console.log(err));
    },
    //bill management
    LoadAllBill: async (req, res, pageNum) => {
        const options = {
            page: pageNum,
            limit: 5,
            lean: true,
        };
        Bill.paginate({}, options, async function (err, result) {
            let listproductbill = await Promise.all(
                result.docs.map(async bill => {
                    let listproduct = await Promise.all(bill.idproducts.map(async idproduct => {
                        let product = await Product.findById(idproduct).lean();
                        return product;
                    }));
                    return ({ ...bill, productlist: listproduct })
                }));
            res.render('./Admin/business-management', {
                layout: 'admin',
                page: 'Quản lý doanh thu',
                business: 'active',
                totalpages: result.totalPages,
                prev: result.prevPage,
                now: result.page,
                next: result.nextPage,
                list: listproductbill,
                User: req.user,
            });
        })
    },

    DeleteBill: async (req, res, id) => {
        Bill.findByIdAndDelete(id)
            .catch((err) => console.log(err));
    },

    Statistic: async (req, res) => {
        Product.find().lean()
            .then((productlist) => {
                User.find().lean()
                    .then((userlist) => {
                        Bill.find().lean()
                            .then((billlist) => {
                                var total=0;
                                billlist.forEach(bill => {
                                    total += bill.money;
                                });
                                res.render('./Admin/statistic', {
                                    layout: 'admin',
                                    page: 'Thống kê',
                                    statistic: 'active',
                                    pSize: productlist.length,
                                    uSize: userlist.length,
                                    totalMoney: total
                                });
                            })
                    })
            })
    },
};

