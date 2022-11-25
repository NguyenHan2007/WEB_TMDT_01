const express = require('express');
// const paypal = require('paypal-rest-sdk');
const router = express.Router();
controllerCart = require('../Controllers/cart.controller');

router.get('/',(req, res)=>{
    var id=req.user._id;;
    controllerCart.LoadCart(req, res, id);
});
router.post('/add/:id',(req, res)=>{
    let idpr = req.params.id;
    var id=req.user._id;
    controllerCart.AddProductToCart(req,res,id,idpr);
});
router.post('/delete/:id',(req, res)=>{
    let idpr = req.params.id;
    var id=req.user._id;
    controllerCart.DeleteProductFromCart(req,res,id,idpr);
});


module.exports = router;