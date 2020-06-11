var express       =require('express'),
    app           =express(),
    bodyParser    =require('body-parser'),
	mongoose      =require('mongoose'),
	flash		  =require('connect-flash'),
	passport      =require('passport'),
	LocalStrategy =require('passport-local'),
	methodOverride=require('method-override'),
	Campground    =require('./models/campground'),
	Comment	      =require("./models/comment"),
	User	      =require("./models/user"),
	seedDB        =require("./seeds")

//REQUIRING ROUTES
var commentRoutes=require('./routes/comments'),
	campgroundRoutes=require('./routes/campgrounds'),
	indexRoutes=require('./routes/index')
	
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());  //should come before passport config
// seedDB();

//	PASSPORT CONFIGURATION
app.use(require("express-session")({
		secret:"I love my college",
		resave:false,
		saveUninitialized:false
		}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//TO PASS through every template by using app.use function
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
})

//USING THE ROUTES
app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes); //as all routes in campgroundRoutes start with "/campgrounds" so we can dry up the code a little by adding this in app.use and removing "/campgrounds" from all the urls in campgrounds.js
app.use("/campgrounds/:id/comments",commentRoutes); //same here

app.listen(3000,function(){
	console.log("The Yelp Camp server has started");
})