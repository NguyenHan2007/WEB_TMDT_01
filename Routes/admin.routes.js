const express = require('express');
const router = express.Router();
controlleradmin = require('../Controllers/admin.controller');
router.get('',(req, res)=>{
    res.redirect('/admin/profile/');
});

router.get('/',(req, res)=>{
    res.render('./Admin/profile',{layout:'admin', page:'Thống kê', profile:'active'});
});

router.get('/statistic',(req, res)=>{
    controlleradmin.Statistic(req, res);
});

router.get('/product-management/:pageNumber',(req, res)=>{
    let pageNumber = req.params.pageNumber;
    controlleradmin.LoadAllProduct(req, res, pageNumber);
});

router.get('/client-management/:pageNumber',(req, res)=>{
    let pageNumber = req.params.pageNumber;
    controlleradmin.LoadAllUser(req, res, pageNumber);
});

router.get('/business-management/:pageNumber',(req, res)=>{
    let pageNumber = req.params.pageNumber;
    controlleradmin.LoadAllBill(req, res, pageNumber);
});
router.get('/profile',(req, res)=>{
    res.render('./Admin/profile',{layout:'admin', page:'Profile', profile:'active'});
    
});

router.post('/client-management/delete/:id',(req, res)=>{
    let id = req.params.id;
    controlleradmin.DeleteUser(req,res,id);
});

router.post('/client-management/upgrade/:id',(req, res)=>{
    let id = req.params.id;
    controlleradmin.UpgradeUser(req,res,id);
});
router.post('/product-management/upgrade/:id',(req, res)=>{
    let id = req.params.id;
    controlleradmin.UpgradeProduct(req,res,id);
});
router.post('/product-management/delete/:id',(req, res)=>{
    let id = req.params.id;
    controlleradmin.DeleteProduct(req,res,id);
});

router.post('/business-management/delete/:id',(req, res)=>{
    let id = req.params.id;
    controlleradmin.DeleteBill(req,res,id);
});

module.exports = router;