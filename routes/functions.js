const firebase = require("firebase")
const db = firebase.database()
var auth = firebase.auth()
const userRef = db.ref("Users")


module.exports.getReviewData = function(req, res) {
  var refDishes= db.ref("Dishes");
  var revdishes = [];
  var revdish;
  var counter = 0
  
  if (req.query.user != null) {
    console.log("REVIEW USER: "+ req.query.user)
    console.log("TERMS: ")
    console.log(req.query)
    
    //query
    refDishes.orderByChild("restaurant_name").equalTo(req.query.restaurant).on("child_added", function (snapshot) {
    	revdish = {name: snapshot.val().name, restaurant_name: snapshot.val().restaurant_name};
    	
    	var dishObject = {
    	  id: revdish.name,
    	  text: revdish.name
    	}
    	
    	revdishes.push(dishObject);
    });
    
    console.log(revdishes)
    
    res.successT({dishes: revdishes})
  } 
  
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

  if (req.body.user != null) {
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
	
	if ( req.body != null) {
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
  var restkey;
  if (req.body != null) {
    var restaurant= req.body.addrestaurant;
    var category = req.body.addtype;
    var dish = req.body.adddishname;
    var desc= req.body.adddishdesc;
    var lcdish = dish.toLowerCase();
    
    var refRest = db.ref("Restaurants");
    refRest.orderByChild("name").equalTo(restaurant).on("child_added", function (snapshot){
      restkey = snapshot.key;
    });
    
    console.log("HEEEEEEEEEEEEEEEEEEEEEEEEEEEEE"+restkey);

    //Add Items to database
    var refDish=db.ref("Dishes");
    var newDishRef = refDish.push({
      restaurant_name: restaurant,
      food_description: desc,
      type: category,
      averageRating: 0,
      number_of_ratings: 0,
      lowercased_name: lcdish,
      restaurant: restkey,
      name: dish
    });
  }
  req.params.restaurant = restkey;
  
  console.log("NEWDISH: "+newDishRef.key)

  res.successT({
    newDishRef: newDishRef.key
  })
  // next()
}

module.exports.addReview = function(req, res, next){
  console.log(req.body);
  var dishkey;
  if (req.body != null) {
    var dish_numofreviews;
    var dish_avgreview;
    var restaurantname= req.body.reviewrestaurant;
    var dishname = req.body.reviewdish;
    var body= req.body.reviewpost;
    var title= req.body.reviewtitle;
    var date = new Date().toJSON().slice(0,10);
    var rating = req.body.reviewrating;
    var user = req.user;
    
    //Needs to get name of user
    var reviewer
    var refUser = db.ref("Users")
    refUser.orderByKey().equalTo(user).on("child_added", function (snapshot){
      reviewer = snapshot.val().name;
    });
    
    //Reviews -> Dish key -> Review key
    var refDish = db.ref("Dishes");
    refDish.orderByChild("name").equalTo(dishname).on("child_added", function (snapshot){
      dishkey = snapshot.key;
      dish_numofreviews = snapshot.val().number_of_ratings +1;
      dish_avgreview = ((snapshot.val().averageRating * (dish_numofreviews-1)) + rating) / dish_numofreviews;
    });
    
    //Add Review to child of restaurants_id database
    var revref= db.ref("Reviews");
    revref.child(dishkey).push({
      body: body,
      rating: rating,
      title: title,
      review_UID: user,
      date: date,
      reviewer_name: reviewer
    });
    
    //Update the dish child in the database
    refDish.child(dishkey).update({
      number_of_ratings : dish_numofreviews,
      averageRating : dish_avgreview
    });
  }
  req.params.dish = dishkey;
  next();
}

module.exports.addFavDish= function(req, res, next){
  if (req.body != null) {
    var user = req.user;
    var dishkey = req.body.favdishkey;
    var add = req.body.add;
    if (add == "true") {
      add = true;
    } else {
      add = false;
    }
    var userFavDishRef = db.ref('Users/').child(user).child("SavedDishes");
    userFavDishRef.update({[dishkey] : add});
  }
  res.redirect('/')
}

module.exports.addFavRes = function(req, res){
  if (req.body != null) {
    var user = req.user
    var reskey = req.body.favreskey;
    var add = req.body.add;
    if (add == "true") {
      add = true;
    } else {
      add = false;
    }
    var userFavResRef = db.ref('Users/').child(user).child("SavedRestaurants");
    userFavResRef.update({[reskey] : add});
  }
  res.redirect('/')
}

module.exports.updateProfile = function(req, res) {
  // var storageRef = firebaes().storage().ref()
  console.log(req.body)
  res.redirect('/profile')
}

module.exports.logout = function(req, res) {
  req.session.destroy(function(err) {
     res.redirect('/')
  })
}