var express = require('express');
var router  = express.Router();
var Campground    =require('../models/campground');
var middleware =require("../middleware");  //no need to write index.js after it because it automatically requires index.js named file in a directory

router.get("/",function(req,res){
	Campground.find({},function(err,allCampgrounds){
		if(err){
			console.log(err)
		} else{
			res.render("campgrounds/index",{campgrounds:allCampgrounds});
		}
	})
})


router.post("/",middleware.isLoggedIn,function(req,res){
	var name=req.body.name;
	var image=req.body.image;
	var desc=req.body.description;
	var price=req.body.price;
	var author={
		id:req.user._id,
		username:req.user.username
	}
	var newCampground={name:name,image:image,description:desc,author:author,price:price};
	Campground.create(newCampground, function(err,newlyCreated){
		if(err){
			console.log(err)
		} else{
			res.redirect("/campgrounds");
		}
	})
})

router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new"); 
});

router.get("/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err)
		} else{
			  if (!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
			res.render("campgrounds/show",{campground:foundCampground});
		}
	})
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		 if (!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
		res.render("campgrounds/edit",{campground:foundCampground});
	})
})

//UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})

//DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            console.log(err);
        }
            res.redirect("/campgrounds");
        });
    })

module.exports= router;