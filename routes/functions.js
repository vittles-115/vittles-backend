const firebase = require("firebase")
const db = firebase.database()
var auth = firebase.auth()
// const userRef = db.ref("")

module.exports.search = function(req, res, next) {
	
}

module.exports.createUser = function(req, res, next) {
	console.log(req.body)
	
	if( req.body != null) {
		var uid = req.body.useremail
		var customToken = auth.createCustomToken(uid)
		
		auth.signInWithCustomToken(customToken).catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  // ...
		  
		  console.log(errorCode)
		  console.log(errorMessage)
		  next()
		});
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