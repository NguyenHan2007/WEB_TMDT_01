const express = require('express');
const paypal = require('paypal-rest-sdk');
const router = express.Router();
const Cart = require("../Models/cart.model");
controllerCart = require('../Controllers/cart.controller');
controllerPay = require('../Controllers/pay.controller');
controllerShop = require('../Controllers/shop.controller');

// router.post('/', (req, res) => {
//     var id = req.user._id;
//     controllerCart.GetTotalPrice(req, res, id).then(total=>{
//         const create_payment_json = {
//             "intent": "sale",
//             "payer": 
//             {
//                 "payment_method": "paypal"
//             },
//             "redirect_urls": 
//             {
//                 "return_url": "http://localhost:32066/paypal/success",
//                 "cancel_url": "https://hcmus-1712452-paypalsandbox.herokuapp.com/canceled"
//             },
//             "transactions": 
//             [
//                 {
//                     "amount":
//                     {
//                         "currency": "USD",
//                         "total": total
//                     },
//                     "description": "Good for you!"
//                 }
//             ]
//         };
//     paypal.payment.create(create_payment_json, function (error, payment) {
//         if (error)
//         {
//             throw error;
//         }
//         else
//         {
//             for(let i = 0;i < payment.links.length;i++)
//             {
//                 if(payment.links[i].rel === 'approval_url')
//                 {
//                     res.redirect(payment.links[i].href);
//                 }
//             }
//         }
//     });
// });
// });
// //test
// router.get('/success', (req, res) => {
//     const payerId = req.query.PayerID;
//     const paymentId = req.query.paymentId;
//     var id = req.user._id;
//     controllerCart.GetTotalPrice(req, res, id).then(total=>{
//     const execute_payment_json = {
//       "payer_id": payerId,
//       "transactions": [{
//           "amount": {
//               "currency": "USD",
//               "total": total
//           }
//       }]
//     };

//     paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
//         if (error) {
//             console.log(error.response);
//             throw error;
//         } else {
//             console.log(JSON.stringify(payment));
//             console.log('Payment Success! Shopping continue...');
//             //res.send('Payment Success! Shopping continue...');
//             res.render('./Client/');
//         }
//     })
// });
// });

//   router.get('/cancel', (req, res) => res.send('Cancelled'));

router.post('/', (req, res) => {
    var id = req.user._id;
    controllerCart.GetTotalPrice(req, res, id).then(total=>{
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "https://hcmuseca09.herokuapp.com/paypal/success",
            "cancel_url": "https://hcmuseca09.herokuapp.com/paypal/cancel"
        },
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": total
            },
            "description": "Good for you!"
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for(let i = 0;i < payment.links.length;i++){
              if(payment.links[i].rel === 'approval_url'){
                res.redirect(payment.links[i].href);
              }
            }
        }
    });
});
});

router.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    var id = req.user._id;
  
    controllerCart.GetTotalPrice(req, res, id).then(total=>{  
    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
          "amount": {
              "currency": "USD",
              "total": total
          }
      }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
            //res.send('Payment Success! Shopping continue...');
            controllerPay.CreateBill(req, res, req.user._id);
            console.log("create bill successfully!");
            Cart.findOne({ iduser: req.user._id }).lean()
                .then(async (MyCart) => {
                    controllerPay.AddCartToCourse(req, res,req.user._id,MyCart.idproducts);
                    Cart.findOneAndUpdate({ iduser: req.user._id }, { idproducts:[]}, function (err, result) { })
                })
                .catch((err) => console.log(err));
                console.log("Add mycourse successfully!");
            res.render('./Client/');
        }
    })
});
});

router.get('/cancel', (req, res) => res.send('Cancelled'));

module.exports = router;