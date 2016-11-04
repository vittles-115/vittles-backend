const firebase = require("firebase")
const db = firebase.database()



module.exports.index = function(req, res) {
	res.renderT('index', {
		template: 'index'
	})
}

module.exports.dish = function(req, res) {
	res.renderT('dish', {
		template: 'dish'
	})
}

module.exports.profile = function(req, res) {
	res.renderT('profile', {
		template: 'profile'
	})
}

module.exports.editprofile = function(req, res) {
	res.renderT('editprofile', {
		template: 'editprofile'
	})
}

module.exports.results = function(req, res) {
	
	
	
	res.renderT('results', {
		template: 'results'
	})
}

module.exports.writereview = function(req, res) {
	res.renderT('writereview', {
		template: 'writereview'
	})
}

module.exports.restaurant = function(req, res) {
	res.renderT('restaurant', {
		template: 'restaurant'
	})
}

module.exports.additem = function(req, res) {
	res.renderT('additem', {
		template: 'additem',
		types:types,
		restaurants: restaurants
	})
}

module.exports.register = function(req, res) {
	res.renderT('register', {
		template: 'register'
	})	
}

//Add Item Categories
var refDishes= db.ref("Dishes");
var types = [];
var firstItem= true;
var prevtype;
refDishes.orderByChild("type").on("child_added",function(snapshot){
	var type = snapshot.val().type;
	if (type != prevtype || firstItem){
		types.push({type: type});
		firstItem=false;
	}
	prevtype = type;
});

//Add Item Restaurants
var restaurants = [];
var restaurant;
var refRes = db.ref("Resturants");
refRes.orderByChild("name").on("child_added", function (snapshot){
	restaurant= {name: snapshot.val().name};
	restaurants.push(restaurant);
});