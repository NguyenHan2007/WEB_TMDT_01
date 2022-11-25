const express = require('express');
const router = express.Router();
controllerMyClass = require('../Controllers/myclass.controller');
router.get('/',(req, res)=>{
    var id=req.user._id;
    controllerMyClass.LoadAllClasses(req, res, id);
});

router.get('/addclass',(req, res) => {
    var id=req.user._id;
    var idtest1="5f310d985c4fd734dc938f99";//id course
    controllerMyClass.addclass(id,idtest1);
 });

router.get('/addcourse',(req, res) => {
    res.render('./Client/sell-course');
 });

 router.post('/addcourse',(req, res, next) => {
    var id=req.user._id;//id user
    var item ={
        name: req.body.name,
        category: req.body.category,
        descriptionshort: req.body.descriptionshort,
        descriptionfull: req.body.descriptionfull,
        price: req.body.price,
        pathImg: req.body.pathImg,
        video: req.body.video,
        discount: req.body.discount
    }
    controllerMyClass.addcourse(req, res, id, item);
    console.log("Add course sucessfully!");
    //var idtest1="5f310d985c4fd734dc938f99";//id class
    //var id = item._id;
    //console.log(id);
    //controllerMyClass.AddCourseToMyClass(idtest2, id);
    //console.log("Add class sucessfully!");
    
    controllerMyClass.LoadAllClasses(req, res, id);
 });

router.get('/:id',(req, res)=>{
    //var idtest="5ed351d941f5691b94684360";
    let id = req.params.id;
    //consolve.log(id);
    controllerMyClass.LoadIdClasses(req, res,id);
    //res.render('./Client/myclass-detail')
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

 router.post('/:id/addlesson',(req, res, next) => {
    let idcourse = req.params.id;//id user
    var lesson_path = req.body.video;
    controllerMyClass.addlesson(req, res, idcourse, lesson_path);
    console.log("Add lesson sucessfully!");
    controllerMyClass.LoadIdClasses(req, res,idcourse);
 });


module.exports = router;