const firebase = require("firebase")
const db = firebase.database()
var auth = firebase.auth()
const userRef = db.ref("Users")

module.exports.search = function(req, res, next) {
  if(req.query!=null){
      var searchType = req.query.type;
      var searchQuery = req.query.query;
      console.log(searchQuery);
      console.log(searchType);
      if(searchType == "Dishes"){
        var ref = db.ref("Dishes");
        var results = [];
        ref.orderByChild("name").startAt(searchQuery).endAt(searchQuery+"\uf8ff").on("child_added", function(snapshot) {
      	  var result = {name: snapshot.val().name, desc: snapshot.val().food_description};
      	  results.push(result);
        });
        console.log(results);
      }else if(searchType == "Restaurants"){
        var ref = db.ref("Restaurants");
        var results = [];
        ref.orderByKey().startAt(searchQuery).endAt(searchQuery+"\uf8ff").on("child_added", function(snapshot) {
       	  result = {name:snapshot.val().name, address: snapshot.val().address};
       	  console.log(result);
       	  results.push(result);
        });
        console.log(results);
      }
      next();
  }

}


module.exports.getReviewData = function(req, res) {
  var refDishes= db.ref("Dishes");
  var revdishes = [];
  var revdish;
  var counter = 0
  
  if(req.query.user != null) {
    console.log("REVIEW USER: "+ req.query.user)
    console.log("TERMS: ")
    console.log(req.query)
    
    //query
    //Thais
    //Write Review: Dishes
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
    var user = req.user;
    //Needs to get name of user
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
      review_UID: user,
      date: date,
      //reviewer_name: reviewer
      reviewer_name: "Thais Aoki",
      thumbnail_URL: ""
    });
  }
  next()
}

module.exports.addFavDish= function(req, res, next){
  if (req.body != null){
    var user = req.user;
    var dishkey= req.body.favdishkey;
    var add=req.body.add;
    if(add=="true"){
      add=true;
    }else{
      add=false;
    }
    var userFavDishRef = db.ref('Users/').child(user).child("SavedDishes");
    userFavDishRef.update({[dishkey] : add});
  }
  res.redirect('/')
}

module.exports.addFavRes = function(req, res){
  if (req.body != null){
    var user = req.user
    var reskey= req.body.favreskey;
    var add=req.body.add;
    if(add=="true"){
      add=true;
    }else{
      add=false;
    }
    var userFavResRef = db.ref('Users/').child(user).child("SavedRestaurants");
    userFavResRef.update({[reskey] : add});
  }
  res.redirect('/')
}

module.exports.logout = function(req, res) {
  
  req.session.destroy(function(err) {
     res.redirect('/')
  })
  
 
  
}