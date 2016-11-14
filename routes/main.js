const firebase = require("firebase")
const db = firebase.database()



module.exports.index = function(req, res) {
	var session = req.session
	var user = getUser(session)
	
	
	
	res.renderT('index', {
		template: 'index',
		dishes: dishes,
		restaurants: hotrestaurants,
		recents: recents,
		user: user
	})
}


module.exports.dish = function(req, res) {
	var session = req.session
	var user = getUser(session)
	
	res.renderT('dish', {
		template: 'dish',
		reviews: recents,
		dishreviews : dishreviews,
		user: user
	})
}

module.exports.restaurant = function(req, res) {
	var session = req.session
	var user = getUser(session)
	
	res.renderT('restaurant', {
		template: 'restaurant',
		user: user
	})
}

module.exports.profile = function(req, res) {
	var session = req.session
	var user = getUser(session)
	
	
	res.renderT('profile', {
		template: 'profile',
		user: user
	})
}

module.exports.editprofile = function(req, res) {
	var session = req.session
	var user = getUser(session)
	
	res.renderT('editprofile', {
		template: 'editprofile',
		user: user
	})
}

module.exports.results = function(req, res) {
	var session = req.session
	var user = getUser(session)
	
	
	res.renderT('results', {
		template: 'results',
		user: user
	})
}

module.exports.writereview = function(req, res) {
	var session = req.session
	var user = getUser(session)
	
	res.renderT('writereview', {
		template: 'writereview',
		restaurants:restaurants,
		dishes:revdishes,
		user: user
	})
}

module.exports.restaurant = function(req, res) {
	var session = req.session
	var user = getUser(session)
	
	res.renderT('restaurant', {
		template: 'restaurant',
		user: user
	})
}

module.exports.additem = function(req, res) {
	var session = req.session
	var user = getUser(session)
	
	res.renderT('additem', {
		template: 'additem',
		types:types,
		restaurants: restaurants,
		user: user
	})
}

module.exports.register = function(req, res) {
	var session = req.session
	var user = getUser(session)
	
	res.renderT('register', {
		template: 'register',
		user: user
	})	
}

module.exports.signin = function(req, res) {
	var session = req.session
	var user = getUser(session)
	
	res.renderT('signin', {
		template: 'signin',
		user: user
	})	
}


// GET USER SESSION

function getUser(session) {
	var user = ""
	
	if ( session.user != null ) {
		console.log("USER: "+user)
		user = session.user
	}
	
	return user
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

//Sveta
//Add Item Reviews
var reviews = [];
var review;
var refRev = db.ref("Reviews");
refRev.orderByChild("name").on("child_added", function (snapshot){
	review= {name: snapshot.val().name};
	reviews.push(review);
});

//Index: Hot dishes
var dishes = [];
var dish;
refDishes.orderByChild("averageRating").limitToFirst(10).on("child_added", function (snapshot) {
	dish = {name: snapshot.val().name, desc: snapshot.val().food_description};
	dishes.push(dish);
});

//Index: Hot Restaurants
var hotrestaurants = [];
refRes.orderByChild("name").on("child_added", function (snapshot){
	hotrestaurants.push({name:snapshot.val().name, address: snapshot.val().address});
});

//Index: Recent? Change to date
var recents = [];
refDishes.orderByChild("number_of_ratings").limitToFirst(10).on("child_added", function (snapshot){
	recents.push({name:snapshot.val().name, desc: snapshot.val().food_description});
});

//Sveta
//Dish: Reviews
var dishreviews = [];
var rev="KTD3kA15O5pPCIv_ep4";
refRev.orderByChild("name").on("child_added", function (snapshot){
	db.ref("Reviews/" + rev).orderByChild("name").on("child_added", function(snapshot){
		dishreviews.push({name: snapshot.val().reviewer_name, title: snapshot.val().title, body:snapshot.val().body, rating:snapshot.val().rating});
	});
});


//Thais
//Write Review: Dishes
var revdishes = [];
var revdish;
refDishes.orderByChild("name").on("child_added", function (snapshot) {
	revdish = {name: snapshot.val().name, restaurant_name: snapshot.val().restaurant_name};
	revdishes.push(revdish);
});