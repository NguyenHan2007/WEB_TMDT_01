const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../Models/user.model');
const Cart = require('../Models/cart.model');
const Course = require('../Models/course.model');
const checkAuthenticated = require('../Middlewares/auth.mdw').checkAuthenticated;

router.get(`/`, (req, res) => {
    if (!req.isAuthenticated()) {
        res.render('./Login/login', { layout: 'login' });
    } else {
        res.redirect('/login/profile');
    }
});
router.post('/', (req, res, next) => {
    const url = new URL(req.headers.referer);
    passport.authenticate('local', {
        successRedirect: url.searchParams.get('retUrl'), //thành công
        failureRedirect: `${req.headers.referer}`, //thất bại
    })(req, res, next);
});


router.get('/register', (req, res) => {
    if (!req.isAuthenticated()) {
        res.render('./Login/register', { layout: 'login' });
    } else {
        res.redirect('/login/profile');
    }
});

router.post('/register', (req, res) => {
    const { username, displayname, email, password, password2, address, birthday, avatar, customCheckRegister } = req.body;
    var role = 1;
    req.session.errors = { msg: '' }
        // kiểm tra đã điền đủ thông tin đang kí chưa
    if (!customCheckRegister) {
        req.session.errors = { msg: 'Please click on (I agree with the Privacy Policy)' };
    } else if (!displayname || !email || !password || !password2 || !address || !birthday) {
        req.session.errors = { msg: 'Please enter all fields' };
    }
    // kiểm tra xác nhận password
    else if (password != password2) {
        req.session.errors = { msg: 'Passwords do not match' };
    }
    // password phải >= 6 kí tự
    else if (password.length < 6) {
        req.session.errors = { msg: 'Password must be at least 6 characters' };
    }
    if (req.session.errors.msg != "") { // nếu có lỗi thì trả về trang đăng kí
        res.render('./Login/register', {
            layout: 'login',
            message: req.session.errors.msg
        });
    } else { // kiểm tra email đăng kí đã tồn tại chưa, nếu rồi thì trở về trang đăng kí
        User.findOne({ email: email }).then(user => {
            if (user) {
                req.session.errors = { msg: 'Email already exists' };
                res.render('./Login/register', { layout: 'login', message: req.session.errors.msg });
            } else { // ngược lại thì lưu dữ liệu và database và trở về trang đăng nhập để đăng nhập tài khoản
                addEmail(req.body.email);
                const newUser = new User({
                    username,
                    displayname,
                    email,
                    password,
                    address,
                    birthday,
                    avatar,
                    role
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                //tạo cart
                                var carts = new Cart({
                                    iduser: user._id,
                                    idproducts: []
                                });
                                carts.save();
                                // Tạo mycourse
                                var courses = new Course({
                                    iduser: user._id,
                                    idproducts: []
                                });
                                courses.save();
                                //Tạo class
                                res.redirect('/login/profile');
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        });
    }
});

// profile
router.get('/profile', checkAuthenticated, (req, res) =>
    res.render('./Login/profile', {
        User: req.user,
        Page: "Profile",
        raw: true,
    })
);

// Đăng xuất
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

// change address
// profile
router.get('/changeaddress', checkAuthenticated, (req, res) =>
    res.redirect('/login/profile')
);
router.post('/changeaddress', (req, res) => {
    var { displayname, address, birthday, avatar } = req.body;
    email = req.user.email;
    //console.log(req.user.birthday);
    req.session.errors = { msg: '' }
        //kiểm tra thông tin đầu vào
    if (!displayname) {
        displayname = req.user.displayname;
    }
    if (!address) {
        address = req.user.address;
    }
    if (!birthday) {
        birthday = req.user.birthday;
    }
    if (!avatar) {
        avatar = req.user.avatar;
    }
    if (req.session.errors.msg != "") { // nếu có lỗi thì trả về trang đăng kí
        //console.log(req.session.errors.msg);
        res.render('./Login/profile', { User: req.user, message: req.session.errors.msg });
    } else { // ngược lại thì update dữ liệu
        User.findOneAndUpdate({ email: email }, { displayname: displayname, address: address, birthday: birthday, avatar: avatar }, function(err, result) {})
            .then(data => {
                req.user = data;
                res.redirect('/login/profile');
            })
            .catch((err) => console.log(err))
    }
    //check session
})
router.post('/changepassword', (req, res) => {
        const { password, password2, password3 } = req.body;
        req.session.errors = { msg: '' }
        user = req.user;
        if (!password || !password2 || !password3) {
            req.session.errors = { msg: 'Please enter all fields' };
        } else if (password2 != password3) {
            req.session.errors = { msg: 'Fail password confirm' };
        } else if (password3.length < 6) {
            req.session.errors = { msg: 'Password must be at least 6 characters' };
        }
        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {} else {
                req.session.errors = { msg: 'Password incorrect' };
            }
        });
        if (req.session.errors.msg != "") { // nếu có lỗi thì trả về trang đăng kí
            //console.log(req.session.errors.msg);
            res.render('./Login/profile', { User: req.user, message: req.session.errors.msg });
        } else { // ngược lại thì update dữ liệu
            email = req.user.email;
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password3, salt, (err, hash) => {
                    if (err) throw err;
                    user.password = hash;
                    User.findOneAndUpdate({ email: email }, { password: user.password }, function(err, result) {})
                        .then(data => {
                            req.user = data;
                            res.redirect('/login/profile');
                        })
                        .catch((err) => console.log(err))
                });
            });
        }
    })
    // change address
    /*
    // Hàm được sử dụng để kiểm tra đã login hay chưa
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/');
    }
    */
function addEmail(email) {
    var request = require('request');
    var options = {
        'method': 'POST',
        'url': 'https://us10.api.mailchimp.com/3.0/lists/e6769b309a/members ',
        'headers': {
            'Authorization': 'Basic YW55c3RyaW5nOjJjOTg2OGY1MDBjZGJlZGJjZmU5NzlhYzc5YjBlZmU4LXVzMTA=',
            'Content-Type': 'application/json',
            'Cookie': 'ak_bmsc=0FEEF6741127A679A8CABA5B0A995B546011489FAE34000076F3E45E8545575B~pl6T+x+5SjOg4br7s5811dhresZF7IzMZBtaw3GeTeMJUmiEqy8BmZhfjaXLldKIYI/0MOPn0Ni/ZQf131ApZldSdQyiUjavixg0/hUGAz5sc+DQ3kzLDtAEkONY2L1HtNIlbeFi0CcDmJdQQenKqoKE+uvLs89KHkmEfhK9GHQ1tYAVSJ6J8xyKIkP9cXGCFe6oWjcfFpZBIw4nKPvdG+S03YJmqzR9pB0lpaWNDtHEo=; bm_sv=C7394B73CB55EFD6BD1E06E39BB136A5~LotHxOKlvgmiVMP6NmrkKFT4U+N62wXqXaVHUXcP1XdMTcI1LDglmygEUn/E5Kauk5uKFEgFj89LRctsNEg6cBmsOfioh2y6dt4wJgYJtWV0u3RgKrjgzoaX2bxD7Yxo8nl4Y0EIkLEVH0fSKLR+ncK6QyJJMPem4voqtfImq+E='
        },
        body: JSON.stringify({ "email_address": email, "status": "subscribed", "merge_fields": {} })

    };
    request(options, function(error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
    });
}
module.exports = router;