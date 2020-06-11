var mongoose	=	require("mongoose")

var commentSchema	=	mongoose.Schema({
	text	:String,
	author  :{
		id:{
			type:mongoose.Schema.Types.ObjectId,   //To refer to the user DB as every comment is written by a user
			ref:"User"
		},
		username:String   //as it is easier to acquire username for every comment rather than finding the username by id
	}
})
module.exports=mongoose.model("Comment",commentSchema);