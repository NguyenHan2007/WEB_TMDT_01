const express = require('express');
const router = express.Router();
controllerMyCourse = require('../Controllers/mycourse.controller');
router.get('/',(req, res)=>{
    //var idtest="5ed674beee9f12138c0b5ad3";
    //console.log(req.user._id);
    var id = req.user._id;
    //console.log(id)
    //var idtest="5ed674beee9f12138c0b5ad3";
    //let idUser =  req.user._id;
    //console.log(idUser);

    controllerMyCourse.LoadAllCourses(req, res, id);
});
router.get('/:id',(req, res)=>{
    //var idtest="5ed0ddf998cb1323fc856543";
     let id = req.params.id;
    // console.log(id);
    // let idUser =  req.user._id;
    // console.log(idUser);
    controllerMyCourse.LoadIdCourses(req, res,id);
    
   // res.render('./Client/mycourse-detail')
 });
router.post('/:id',(req,res,next)=>
{
    var cmt ={comment: req.body.cmt}
    let id = req.user._id;//iduser
    var idPr=req.params.id;
    controllerMyCourse.addComment(req, res, id,idPr, cmt);
 //   console.log("Add comment sucessfully!");
   // controllerMyCourse.LoadIdCourses(req, res, idPr);
    // controllerMyCourse.LoadAllCourses(req, res, id);
});
// router.get('/:id/:sttvideo',(req, res)=>{
//     //var idtest="5ed0ddf998cb1323fc856543";
//      let id = req.params.id;
//      let sttvideo = req.params.sttvideo;
//      console.log(req.params)
//     // console.log(id);
//     // let idUser =  req.user._id;
//     // console.log(idUser);
//     controllerMyCourse.LoadVideo(req, res,id,sttvideo);
    
//    // res.render('./Client/mycourse-detail')
//  });
module.exports = router;