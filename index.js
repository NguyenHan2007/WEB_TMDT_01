let express = require('express');
let app = express();
var path = require('path');
var morgan = require('morgan');
var engine = require('consolidate');

const paypal = require('paypal-rest-sdk');
//config paypal app
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AYXgXFp8-1WDpjfsZb3HA6s_JqCZvHoMVHzNtpvb5yLN3i56qqjlSSCsiE1XWdpiHPNirq5kujDvg8Ii',
    'client_secret': 'EJnLIJ8QYFdkCVu7dqJ1gEl5BiTNG2issgwXJ9dIZaCDnH_3IEH9T2mUnLGsBw-fOCUa72BV21UhOcBk'
});

//app.use(morgan('dev')); // sử dụng để log mọi request ra console
var passport = require('passport');
require('./Controllers/login.controller')(passport); // cấu hình passport, 1 lib sử dụng cho việc authentication của chúng ta
var flash = require('connect-flash');


User = require('./Models/user.model');
//const PORT = process.env.PORT || 5000;
const URI = "mongodb://Admin:!123456@ac-xjse6bw-shard-00-00.hytckvs.mongodb.net:27017,ac-xjse6bw-shard-00-01.hytckvs.mongodb.net:27017,ac-xjse6bw-shard-00-02.hytckvs.mongodb.net:27017/?ssl=true&replicaSet=atlas-jfuj7n-shard-0&authSource=admin&retryWrites=true&w=majority";




//set public static folder
app.use(express.static(__dirname + '/Public'));
//use view engine
let expressHbs = require('express-handlebars');
let hbs = expressHbs.create({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/Layouts',
    partialsDir: __dirname + '/views/Partials'
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.engine('.jade', require('jade').renderFile)
    //Use Body parser
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Use Cookie-parser
let cookieParser = require('cookie-parser');
app.use(cookieParser());

//Use Session
let session = require('express-session');
app.use(session({
    cookie: { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 },
    secret: 'Secret',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//define your routers here

require('./Databases/mongodb')(URI);
require('./Middlewares/routes.mdw')(app);

//signup route 
app.post('/', (req, res) => {
    addEmail(req.body.email);
    console.log(req.body.email);
    res.send('<link type="text/css" rel="stylesheet" href="/css/style.css" /><h3>THANK YOU FOR SUBMIT</h3><link type="text/css" rel="stylesheet" href="/css/style.css" />  <div class="shoping__cart__btns"><a href="/" class="primary-btn cart-btn">BACK TO HOME</a></div>');
});


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

//set server port & start server 
app.listen(process.env.PORT || 32066, () => {
    console.log(`Server is running at port ${process.env.PORT || 32066}`);
});