var Campground=require("../models/campground");
var Comment=require("../models/comment");

//all the middleware functions go here
var middlewareObj={};

middlewareObj.checkCampgroundOwnership=function(req,res,next){
	//is user logged in
	if(req.isAuthenticated()){
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err){
			req.flash("error","Campground  not found")
			res.redirect("back");
		} else{
			// Added this block, to check if foundCampground exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
            if (!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
			//does user own the campground?
			if(foundCampground.author.id.equals(req.user._id)){  
				//we used the .equal() function by mongoose because foundCampground.author.id is an object whereas other                  is a string
				next();
			} else{
				req.flash("error","You don't have permission to do that")
				res.redirect("back");
			}
		}
	}) 
	} else{
		req.flash("error","You need to be logged in to do that")
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership=function(req,res,next){
	//is user logged in
	if(req.isAuthenticated()){
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){
			req.flash("error","Comment  not found")
			res.redirect("back");
		} else{
			 if (!foundComment) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
			//does user own the comment?
			if(foundComment.author.id.equals(req.user._id)){  
				//we used the .equal() function by mongoose because foundComment.author.id is an object whereas other                  is a string
				next();
			} else{
				req.flash("error","You don't have permission to do that")
				res.redirect("back");
			}
		}
	}) 
	} else{
		req.flash("error","You need to be logged in to do that")
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn=function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be logged in to do that");
	res.redirect("/login");
}

module.exports=middlewareObj;