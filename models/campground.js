var mongoose=require('mongoose');

var campgroundSchema = new mongoose.Schema({
	name: String,
	price:String,
	image: String,
	description: String,
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,   //To refer to the user DB as every campground is submitted by a user
			ref:"User"
		},
		username:String
	},
	comments:[
		{
			type:mongoose.Schema.Types.ObjectId,  //to refer to the comments DB by object references
			ref:"Comment"
		}
	]
});

module.exports=mongoose.model("Campground",campgroundSchema);