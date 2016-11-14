const firebase = require("firebase")
const db = firebase.database()
var auth = firebase.auth()
const userRef = db.ref("Users")

module.exports.search = function(req, res, next) {
//     console.log(req.body);
//     if (req.body != null){
//       //is the search request on dishes or restuarant
//       var dish_or_rest = req.body.dish_or_rest;
//       //what was inputted into the search bar
//       var search_key = req.body.search_key;
//       var results = [];
//       if(dish_or_rest == "dish"){
//         var ref = db.ref("Dish");
//         ref.orderByKey().startAt(search_key).endAt(search_key+"\uf8ff").on("child_added", function(snapshot) {
//          	results = {name: snapshot.val().name, desc: snapshot.val().food_description};
//          	results.push(dish);
//         });
//       }else if(dish_or_rest == "rest"){
//         var ref = db.ref("Restaurant");
//         ref.orderByKey().startAt(search_key).endAt(search_key+"\uf8ff").on("child_added", function(snapshot) {
//          	results = {name: snapshot.val().name, desc: snapshot.val().food_description};
//          	results.push(dish);
//         });
//       }
//   }
// });
      
//     }
	
}

module.exports.auth = function(req, res, next) {
  var session = req.session
  var user = ""
	
	if ( session.user != null ) {
		console.log("USER: "+session.user)
		user = session.user
	}
	
  req.user = user
  next()
}

module.exports.validateUser = function( req, res ) {
  var session = req.session
  var uid = ""

  if(req.body.user != null) {
    uid = req.body.user
  } else {
    res.errorT()
  }
  
  session.user = uid

  res.successT()
  
}

module.exports.createUser = function(req, res, next) {
  var session = req.session
  
  
	console.log(req.body.user)
	
	if( req.body != null) {
		var uid = req.body.user
		var newUserRef = userRef.child(uid)
		newUserRef.update({
		  "SavedDishes" : {},
		  "SavedRestaurants": {},
		  "general_location": req.body.location,
		  "name" : req.body.name,
		  "thumbnail_URL": ""
		}).then(function() {
		  session.user = uid;
		  res.successT()
		}).catch(function() {
		  res.errorT({
		    message: "Error writing new user info"
		  })
		})
		
	}
	
	
}

module.exports.addItem = function(req, res, next){
  console.log(req.body);
  if (req.body != null){
    var restaurant= req.body.addrestaurant;
    var category = req.body.addtype;
    var dish = req.body.adddishname;
    var desc= req.body.adddishdesc;
    //var image = req.body.adddishimage;

    //Add Items to database
    var ref=db.ref("Dishes");
    ref.push({
      restaurant_name: restaurant,
      food_description: desc,
      type: category,
      name: dish,
      //thumbnail_URL: image
    });
  }
  next()
}

module.exports.addReview = function(req, res, next){
  console.log(req.body);
  if (req.body != null){
    var restaurantname= req.body.reviewrestaurant;
    var dishname = req.body.reviewdish;
    var body= req.body.reviewpost;
    var title= req.body.reviewtitle;
    var date = new Date().toJSON().slice(0,10);
    var rating = req.body.reviewrating;
    //var revieweruid = user.uid;
    //var revieweruid = auth.currentUser.uid;
    //needs to get user name from user.uid
    //var reviewer= user.name;

    //Reviews -> Dish key -> Review key
    var dishkey;
    var refDish = db.ref("Dishes");
    refDish.orderByChild("name").equalTo(dishname).on("child_added", function (snapshot){
      dishkey = snapshot.key;
    });

    //Add Review to child of restaurants_id database
    var revref= db.ref("Reviews").child(dishkey);
    revref.push({
      body: body,
      rating: rating,
      title: title,
      // review_UID: revieweruid,
      review_UID: "uid",
      date: date,
      //reviewer_name: reviewer
      reviewer_name: "Thais Aoki",
      //thumbnail_URL: image
    });
  }
  next()
}

module.exports.logout = function(req, res) {
  
  req.session.destroy(function(err) {
     res.redirect('/')
  })
  
 
  
}