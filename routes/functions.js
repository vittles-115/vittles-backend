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