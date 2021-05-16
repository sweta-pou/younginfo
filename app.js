const express = require('express');
const app = express();
const fetch = require("node-fetch");
 const flash = require ("connect-flash");

const bodyParsor = require("body-parser");
const route = require('./route/route');
app.use(bodyParsor.urlencoded({extended:true}));

app.set("view engine","ejs");
app.use(require("express-session")(
    {
        secret:"internship",
        resave:false,
        saveUninitialized:false
    }
    ));
app.use(flash());
app.use(function(req,res,next){
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})
app.use(route);
app.use(express.static(__dirname+"/public"));
var port = process.env.PORT || 2000;
 
app.listen(port,function()
{
    console.log(" started!!!");
}
);
//   app.listen("2000",function()
// {
//     console.log(" started");
// }
// );