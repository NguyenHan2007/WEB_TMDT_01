const Course = require("../Models/course.model");
const Bill = require("../Models/bill.model");
const Cart = require("../Models/cart.model");
const Product = require("../Models/product.model");

module.exports = {
    AddCartToCourse: async (req, res, id, listidpr) =>//id: id của user, vì mỗi user có 1 cart nên lấy id cart. Thêm 1 giá trị vào hàm là cmt để lưu giá trị comment
    {
        Course.findOne({ iduser:id }).lean()//tìm đến course của người có id = id
            .then((course) => {//kết quả tìm được gán vào course
                var id_product=course.idproducts.concat(listidpr);
                Course.findOneAndUpdate({ iduser: id}, { idproducts: id_product}, function (err, result) { })
            })
            .catch((err) => console.log(err))
    },

    CreateBill: async (req, res, idUser) =>//id: id của user, vì mỗi user có 1 cart nên lấy id cart. Thêm 1 giá trị vào hàm là cmt để lưu giá trị comment
    {
        Cart.findOne({ iduser: idUser }).lean()
            .then(async (MyCart) => {
                let TotalPrice = 0;
                let TotalDiscount = 0;
                let listproduct = await Promise.all(MyCart.idproducts.map(async idproduct => {
                    let product = await Product.findById(idproduct).lean();
                    TotalPrice += product.price;
                    TotalDiscount += product.price*product.discount;
                    
                    return ({...product, discountpercent: product.discount*100});
                }));
                let Money = TotalPrice - TotalDiscount;
                const newBill = new Bill({
                    iduser: idUser,
                    idproducts: MyCart.idproducts,
                    payment: {
                        id: 1,
                        name: "Paypal"
                    },
                    totalprice: TotalPrice,
                    discount: TotalDiscount,
                    money: Money,
                });
                    newBill
                        .save()
                        .catch((err) => console.log(err))
            })
    },
    CreateBillVNPay: async (req, res, idUser) =>//id: id của user, vì mỗi user có 1 cart nên lấy id cart. Thêm 1 giá trị vào hàm là cmt để lưu giá trị comment
    {
        Cart.findOne({ iduser: idUser }).lean()
            .then(async (MyCart) => {
                let TotalPrice = 0;
                let TotalDiscount = 0;
                let listproduct = await Promise.all(MyCart.idproducts.map(async idproduct => {
                    let product = await Product.findById(idproduct).lean();
                    TotalPrice += product.price;
                    TotalDiscount += product.price*product.discount;
                    
                    return ({...product, discountpercent: product.discount*100});
                }));
                let Money = TotalPrice - TotalDiscount;
                const newBill = new Bill({
                    iduser: idUser,
                    idproducts: MyCart.idproducts,
                    payment: {
                        id: 2,
                        name: "VNPay"
                    },
                    totalprice: TotalPrice,
                    discount: TotalDiscount,
                    money: Money,
                });
                    newBill
                        .save()
                        .catch((err) => console.log(err))
            })
    },
}