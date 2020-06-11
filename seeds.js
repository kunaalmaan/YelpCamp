var mongoose  	=	require('mongoose'),
	Campground	=	require("./models/campground"),
	Comment   	=	require("./models/comment")
	data        =[
		{
			name:"Cloud's Rest",
			image:"https://img.traveltriangle.com/blog/wp-content/uploads/2019/11/CAMPING-IN-DHARAMSHALA-29_nov.jpg",
			description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
		},
		{
			name:"Desert Mesa",
			image:"https://assets.traveltriangle.com/blog/wp-content/uploads/2016/10/Camping-Sites-Near-Bangalore.jpg",
			description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
		},
		{
			name:"Canyon Floor",
			image:"https://toib.b-cdn.net/wp-content/uploads/2017/08/chandratal-lake-himachal-pradesh.jpg",
			description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
		}
	]
function seedDB(){
	//REMOVE FEW CAMPGROUNDS
	Campground.remove({},function(err){
	if(err){
		console.log(err)
	} else{
		console.log("Removed campgrounds");
		//ADD ALL CAMPGROUNDS
		data.forEach(function(seed){
			Campground.create(seed, function(err,campground){
				if(err){
					console.log(err)
				} else{
					console.log('Added a Campground');
					//CREATE A COMMENT
					Comment.create({
						text:"Beautiful place but I wish there was internet",
						author:"Homer"
					}, function(err,comment){
						if(err){
							console.log(err)
						} else{
							campground.comments.push(comment);
							campground.save();
							console.log("Created new comment!");
						}
					})
				}
			})
		})
	}
});
	
	
}
module.exports=seedDB;