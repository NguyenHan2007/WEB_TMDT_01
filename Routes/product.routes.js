const express = require("express");
const router = express.Router();
controllerProduct = require("../Controllers/product.controller");
router.get("/Allproduct", (req, res) => {
  let pageNumber = req.query.page;
  let sort = req.query.sortby;
  if (!pageNumber) {
    pageNumber = 1;
  }

  controllerProduct.loadall(req, res, pageNumber, sort);
});
router.get("/details/:id", (req, res) => {
  let id = req.params.id;
  controllerProduct.loadId(req, res, id);
});
router.get("/search", (req, res) => {
  let query = req.query.nameproduct;
  let query2 = req.query.namecategory;
  let query3 = req.query.price;
  let query4 = req.query.author;
  let pageNumber = req.query.page;
  let sort = req.query.sortby;
  if (!pageNumber) {
    pageNumber = 1;
  }

  if (query) {
    //console.log('query search= '+ query+ " page = "+pageNumber);
    controllerProduct.loadSearchByNameProduct(
      req,
      res,
      query,
      pageNumber,
      sort
    );
  }
  if (query2) {
    //console.log('query search= '+ query2+ " page = "+pageNumber);
    controllerProduct.loadSearchByNameCategory(
      req,
      res,
      query2,
      pageNumber,
      sort
    );
  }
  if (query3) {
    controllerProduct.loadSearchByPrice(req, res, query3, pageNumber, sort);
  }
  if (query4) {
    controllerProduct.loadSearchByNameAuthor(req, res, query4, pageNumber, sort);
  }
  //console.log("this is" +  pageNumber);
});
// router.get('/search/namecategory=:namecategory/:page',(req,res)=>{
//     let query = req.params.namecategory;
//     let pageNumber = req.params.page;
//     console.log('query search= '+ query);
//     if(!pageNumber){
//         pageNumber = "1"
//     }

//         controllerProduct.loadSearchByNameCategory(req, res,query,pageNumber);
//     //console.log("this is" +  pageNumber);
// });

module.exports = router;
