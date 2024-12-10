// Create web server
// npm install express
// npm install body-parser
// npm install ejs
// npm install mongoose
// npm install express-sanitizer
// npm install method-override
// npm install express-session
// npm install connect-flash
// npm install passport
// npm install passport-local
// npm install passport-local-mongoose

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Comments = require("./models/comments");
var seedDB = require("./seeds");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var methodOverride = require("method-override");
var flash = require("connect-flash");

// Requiring routes
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");

// seedDB(); // Seed the database
mongoose.connect("mongodb://localhost/comments_v12", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// Passport configuration
app.use(require("express-session")({
    secret: "Once again, Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/comments", commentRoutes);

app.listen(3000, function(){
    console.log("The server has started!");
});