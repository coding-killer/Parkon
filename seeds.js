var mongoose=require("mongoose");
var Campground=require("./models/campground");
var Comment=require("./models/comment");
var data=[{
	name:"cloud rest",
	image:"https://images.unsplash.com/photo-1536478655104-526ad3655671?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=be5b28d6da167f73a38ffa90c5ff502e&auto=format&fit=crop&w=500&q=60",
	description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)"

},
{
	name:"kkkkkokok",
	image:"https://images.unsplash.com/photo-1536420111820-d84dee5c90c5?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d76602c3cafa0599d42cfdf255c5eb8d&auto=format&fit=crop&w=500&q=60",
    description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)"

},
{
	name:"jjn hbj",
	image:"https://images.unsplash.com/photo-1536448766291-22eaf209f06e?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=29ab3be95c5b6ac138c32ac5e841d716&auto=format&fit=crop&w=500&q=60",
    description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)"

}
];

function seedDB(){
	//remove all campgrounds
Campground.remove({},function(err){
// 	if(err){console.log(err);}
// 	console.log("removed campground!!");
// 	//add few campground
// data.forEach(function(seed){
// Campground.create(seed,function(err,campground){
// 	if(err){
// 		console.log(err);
// 	}
// 	else{
// 		console.log("added a campground");
// 		//create a comment
// 		Comment.create({
// 			text:"This place is great but no internet",
// 			author:"Homer"
// 		},function(err,comment){
// 			if(err){
// 				console.log(err);
// 			}
// 			else{
// 				campground.comments.push(comment);
//                 campground.save();
//                 console.log("created new comment!!");

// 			}
          
// 		});
// 	}
// }); 
// });
});


}

module.exports=seedDB;