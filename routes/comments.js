var express = require('express');
var router  = express.Router({mergeParams:true}); //so that the routes are able to acquire ":id" param from the app.use("/campgrounds/:id/comments",commentRoutes) line in app.js
var Campground    =require('../models/campground');
var Comment	      =require("../models/comment");
var middleware =require("../middleware");  //no need to write index.js after it because it automatically requires index.js named file in a directory


router.get("/new",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err){
			console.log(err)
		} else{
			 if (!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
			res.render("comments/new",{campground:foundCampground});
		}
	})
})

router.post("/",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err){
			console.log(err)
		} else{
			 if (!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					req.flash("error","Something went wrong")
					console.log(err)
				} else{
					//add username and id to comment
					comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					//save comment
					comment.save();
					foundCampground.comments.push(comment);
					foundCampground.save();
					req.flash("Success","Successfully added comment")
					res.redirect("/campgrounds/" + foundCampground._id);
				}
			})
		}
	})
})

//edit comment
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){
			res.redirect("back");
		} else{
			 if (!foundComment) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
			res.render("comments/edit",{campground_id:req.params.id,comment:foundComment});
		}
	})
})

//update comment
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
		if(err){
			res.redirect("back");
		} else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})

//destroy comment
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err,updatedComment){
		if(err){
			res.redirect("back");
		} else{
			req.flash("success","Comment deleted")
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})



module.exports= router;