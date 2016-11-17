const firebase = require("firebase")
const db = firebase.database()



module.exports.index = function(req, res) {
	
	
	
	res.renderT('index', {
		template: 'index',
		dishes: dishes,
		restaurants: hotrestaurants,
		recents: recents,
		user: req.user
	})
}


module.exports.dish = function(req, res) {

	
	res.renderT('dish', {
		template: 'dish',
		reviews: recents,
		dishreviews : dishreviews,
		user: req.user
	})
}


module.exports.profile = function(req, res) {
	var session = req.session
	var user = req.user
	var profile;
	var favdisheskeys= [];
	var favdishes=[];
	var favreskeys=[];
	var favres=[];
	for(var i=0; i<profiles.length; i++){
		if (profiles[i].key == req.user){
			profile= {name: profiles[i].name, location: profiles[i].location, savedDishes: profiles[i].savedDishes, savedRestaurants: profiles[i].savedRestaurants};
		}
	}
	//Favorite Dishes
	for (var key in profile.savedDishes) {
		if(profile.savedDishes[key]){
			favdisheskeys.push(key);
		}
	}
	for(var i=0; i<favdisheskeys.length; i++) {
		refDishes.orderByKey().equalTo(favdisheskeys[i]).on("child_added", function (snapshot) {
			favdishes.push({name: snapshot.val().name, desc: snapshot.val().food_description});
		});
	}
	
	//Favorite Restaurants
	for (var key in profile.savedRestaurants) {
		if(profile.savedRestaurants[key]){
			favreskeys.push(key);
		}
	}
	for(var i=0; i<favreskeys.length; i++) {
		refRes.orderByKey().equalTo(favreskeys[i]).on("child_added", function (snapshot) {
			favres.push({name: snapshot.val().name, address: snapshot.val().address});
		});
	}
	
	res.renderT('profile', {
		template: 'profile',
		user: req.user,
		profile: profile,
		favdishes: favdishes,
		//favres: favres
	})
}

module.exports.editprofile = function(req, res) {
	
	res.renderT('editprofile', {
		template: 'editprofile',
		user: req.user
	})
}

//HERESHWETHA
module.exports.results = function(req, res) {
	console.log(req.results)
	
	res.renderT('results', {
		template: 'results',
		user: req.user
	})
}

module.exports.writereview = function(req, res) {


		console.log(restaurants)
	
	
		res.renderT('writereview', {
			template: 'writereview',
			restaurants: restaurants,
			dishes: revdishes,
			user: req.user
		})
	// })
	

}

module.exports.restaurant = function(req, res) {
	var restaurantName = req.params.restaurant
	console.log("RESTAURANT: "+restaurantName)

	
	var restaurantData
	
	var restaurantRef = db.ref("Restaurants")
	
	restaurantRef.once('value', function(snapshot) {
		if(snapshot.hasChild(restaurantName)) {
			restaurantData = snapshot.val()[restaurantName]
			console.log(restaurantData)
			res.renderT('restaurant', {
				template: 'restaurant',
				restaurant: restaurantData,
				user: req.user,
				dishes: dishes
			})
		} else {
			res.redirect("/")
		}
	})
	
	// Old code
	
	// var dishes = [];
	
}

module.exports.additem = function(req, res) {
	
	res.renderT('additem', {
		template: 'additem',
		types:types,
		restaurants: restaurants,
		user: req.user
	})
}

module.exports.register = function(req, res) {
	
	res.renderT('register', {
		template: 'register',
		user: req.user
	})	
}

module.exports.signin = function(req, res) {
	
	res.renderT('signin', {
		template: 'signin',
		user: req.user
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
var refRes = db.ref("Restaurants");
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
	dish = {name: snapshot.val().name, desc: snapshot.val().food_description, key: snapshot.key};
	dishes.push(dish);
});

//Index: Hot Restaurants
var hotrestaurants = [];
refRes.orderByChild("name").on("child_added", function (snapshot){
	hotrestaurants.push({name:snapshot.val().name, address: snapshot.val().address, key: snapshot.key});
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

//Thais
//Profiles
var profiles = [];
var refUsers = db.ref("Users");
refUsers.orderByChild("name").on("child_added", function (snapshot){
	var profile = {name: snapshot.val().name, location: snapshot.val().general_location, key: snapshot.key, savedDishes: snapshot.val().SavedDishes, savedRestaurants:snapshot.val().SavedRestaurants};
	profiles.push(profile);
});