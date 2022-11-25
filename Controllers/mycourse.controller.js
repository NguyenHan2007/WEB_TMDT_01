const Course = require("../Models/course.model");
const Product = require("../Models/product.model");
const User = require("../Models/user.model");
module.exports = {
  LoadAllCourses: async (req, res, idUser) => {
    Course.findOne({ iduser: idUser }).lean()
      .then(async (MyCourse) => {
        let listproduct = await Promise.all(MyCourse.idproducts.map(async idproduct => {
          let product = await Product.findById(idproduct).lean();
          return (product);
        }));
        //console.log(MyCourse);
        //console.log(listproduct);
        res.render('./Client/mycourse', {
          layout: 'client',
          list: listproduct,
          User: req.user,
          Page: "Courses",
        });
      })
      .catch((err) => console.log(err));
  },
  LoadIdCourses: async (req, res, id) => {
    Course.findOne({ iduser: req.user._id }).lean()
      .then(async (courseList) => {
        //console.log(courseList.idproducts)
        //console.log(xacthuc(courseList,id))
        if (xacthuc(courseList, id) == 1) {
          Product.findById(id)
            .lean()
            .then(async (productList) => {
              if (Array.isArray(productList.comment)) {
                let listUserComment = await Promise.all(productList.comment.map(async comment => {
                  let uscomment = await User.findById(comment.iduser).lean();
                  return (uscomment);
                }));
                // productList.comment.forEach(({iduser}) => {
                // console.log(iduser)
                // 

                var UserComment = [{
                  nameduser: {},
                  com: {},
                }]
                var UserComment1 = {
                  nameduser: {},
                  com: {},
                }
                for (var i = 0; i < listUserComment.length; i++) {
                  UserComment1.nameduser = (listUserComment[i].displayname);
                  UserComment1.com = (productList.comment[i].com);
                  //console.log(UserComment1.nameduser);
                  //console.log(UserComment1.com);
                  UserComment[i] = (UserComment1);
                  var UserComment1 = {
                    nameduser: {},
                    com: {},
                  }
                }
              }
              res.render("./Client/mycourse-detail", {
                layout: 'client',
                Product: productList,
                User: req.user,
                Page: "Courses",
                UserComment: UserComment,
              });


              //.catch((err) => console.log(err));
            })
        }
        else {
          res.render("./error", { layout: '' });
        }
      })
    // .catch((err) => console.log(err));
  },
  addComment: async (req, res, idUs, idPr, cmt) =>//id: id của cart, vì mỗi user có 1 cart nên lấy id cart. Thêm 1 giá trị vào hàm là cmt để lưu giá trị comment
  {//tạo 1 object có iduser:id, cmt: cmt
    var ObjectComment = {
      iduser: idUs,
      com: cmt.comment,
    }
    //thay vì tìm đến giỏ hàng thì tìm đến product có giá trị id:idpr. rồi push cái object vừa tạo vào comment. làm xong rồi xóa phần chú thích này đi.oke 
    Product.findOne({ _id: idPr }).lean()//tìm đến giỏ hàng của người có id = id
      .then((product) => {//kết quả tìm được gán vào cart
        if (Array.isArray(product.comment)) {
          product.comment.push(ObjectComment);
        }
        else {
          product.comment = [ObjectComment];
        }
        //vì idproducts là array danh sách idproduct nên dùng hàm push để thêm vào cuối.
        var newComment = product.comment;
        Product.findOneAndUpdate({ _id: idPr }, { comment: newComment }, function (err, result) { })
      })
      .catch((err) => console.log(err))
  }
  // loadVideo: async (req, res,id,sttvideo) =>
  // {

  // }
};
function xacthuc(courseList, id) {
  var maxacthuc = 0
  for (var i = 0; i < courseList.idproducts.length; i++) {
    if (courseList.idproducts[i] == id) {
      maxacthuc = 1
    }
  }
  return maxacthuc;
}
