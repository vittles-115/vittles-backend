const firebase = require("firebase")
const db = firebase.database()



module.exports.index = function(req, res) {
	res.renderT('index', {
		template: 'index',
		dishes: dishes,
		restaurants: hotrestaurants,
		recents: recents
	})
}


module.exports.dish = function(req, res) {
	res.renderT('dish', {
		template: 'dish',
		reviews: recents,
		dishreviews : dishreviews
	})
}

module.exports.restaurant = function(req, res) {
	res.renderT('restaurant', {
		template: 'restaurant'
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
		template: 'writereview',
		restaurants:restaurants,
		dishes:revdishes,
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
//Okay so the problem is that Firebase for the Reviews is set up as Dish key -> Review key
//that means that if you just do refRev.orderByChild("name") it will query the Review key 
//which is why it doesn't show snapshot.val().reviewer_name.
var dishreviews = [];
var rev=[];
refRev.orderByChild("name").on("child_added", function (snapshot){
	var dishkey= snapshot.key;
	rev.push(dishkey);
});
refRev.orderByChild("name").on("child_added", function (snapshot){
	for(var i=0; i< rev.length;i++){
		db.ref("Reviews/" + rev[i]).orderByChild("name").on("child_added", function(snapshot){
			dishreviews.push({name: snapshot.val().reviewer_name, title: snapshot.val().title, body:snapshot.val().body, rating:snapshot.val().rating});
		});
	}
});


//Thais
//Write Review: Dishes
var revdishes = [];
var revdish;
refDishes.orderByChild("name").on("child_added", function (snapshot) {
	revdish = {name: snapshot.val().name, restaurant_name: snapshot.val().restaurant_name};
	revdishes.push(revdish);
});