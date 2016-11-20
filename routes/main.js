const firebase = require("firebase")
const db = firebase.database()



module.exports.index = function(req, res) {
	var session = req.session
	var user = req.user
	var favdisheskeys= []
	var favreskeys = []
	var dishes = []
	var dish
	var userFav
	var restaurants=[]
	var restaurant
	var userRef = db.ref("Users")
	if(user == null || user==''){
		refDishes.orderByChild("averageRating").limitToFirst(10).on("child_added", function (snapshot) {
			dish = {
				name: snapshot.val().name,
				desc: snapshot.val().food_description,
				key: snapshot.key,
				img:snapshot.val().thumbnail_URL,
				resname: snapshot.val().restaurant_name,
				rating: snapshot.val().averageRating,
				numrating: snapshot.val().number_of_ratings,
				saved: false
			};
			dishes.push(dish);
		});

		refRes.orderByChild("name").limitToFirst(10).on("child_added", function (snapshot) {
			restaurant = {
				name: snapshot.val().name,
				address: snapshot.val().address,
				key: snapshot.key,
				saved: false
			};
			restaurants.push(restaurant);
		});

		res.renderT('index', {
			template: 'index',
			dishes: dishes,
			restaurants: restaurants,
			recents: recents,
			user: req.user
		})
	}else{
		//Get users Favorite Dishes/Restaurants
		userRef.orderByKey().equalTo(user).once("value", function(snapshot) {
			userFav = {
				savedDishes: snapshot.val()[user]["SavedDishes"],
				savedRestaurants: snapshot.val()[user]["SavedRestaurants"]
			}
		}).then(function() {
			//User Favorite Dishes
			for (var key in userFav.savedDishes) {
				if(userFav.savedDishes[key]){
					favdisheskeys.push(key);
				}
			}

			//For the top 10 dishes, color red if it is users' favorites
			refDishes.orderByChild("averageRating").limitToFirst(10).on("child_added", function (snapshot) {
				for(var i=0;i<favdisheskeys.length;i++){
					if(favdisheskeys[i]==snapshot.key){
						dish = {
							name: snapshot.val().name,
							desc: snapshot.val().food_description,
							key: snapshot.key,
							img:snapshot.val().thumbnail_URL,
							resname: snapshot.val().restaurant_name,
							rating: snapshot.val().averageRating,
							numrating: snapshot.val().number_of_ratings,
							saved: true
						};
						break;
					}else{
						dish = {
							name: snapshot.val().name,
							desc: snapshot.val().food_description,
							key: snapshot.key,
							img:snapshot.val().thumbnail_URL,
							resname: snapshot.val().restaurant_name,
							rating: snapshot.val().averageRating,
							numrating: snapshot.val().number_of_ratings,
							saved: false
						};
					}
				}
				dishes.push(dish);
			});

			//User Favorite Restaurants
			for (var key in userFav.savedRestaurants) {
				if(userFav.savedRestaurants[key]){
					favreskeys.push(key);
				}
			}
			//For the top 10 restaurants, color red if it is users' favorites
			refRes.orderByChild("name").limitToFirst(10).on("child_added", function (snapshot) {
				for(var i=0;i<favreskeys.length;i++){
					if(favreskeys[i]==snapshot.key){
						restaurant = {
							name: snapshot.val().name,
							address: snapshot.val().address,
							key: snapshot.key,
							saved: true
						};
						break;
					}else{
						restaurant = {
							name: snapshot.val().name,
							address: snapshot.val().address,
							key: snapshot.key,
							saved: false
						};
					}
				}
				restaurants.push(restaurant);
			});

		}).then(function() {
			res.renderT('index', {
				template: 'index',
				dishes: dishes,
				restaurants: restaurants,
				recents: recents,
				user: req.user
			})
		})
	}
}


module.exports.dish = function(req, res) {
	var dishId = req.params.dish;

	//console.log("DISH: "+dishId);

	var dishRef = db.ref("Dishes");
	var revRef = db.ref("Reviews");
	//console.log(revRef);
	var dishData;
	var dishReviews = [];
	
	dishRef.once('value', function(snapshot) {
		if(snapshot.hasChild(dishId)) {
			dishData = snapshot.val()[dishId];
			//console.log("1");
			//console.log(dishData);
		} else {
			res.redirect("/")
		}
	}).then(function() {
		// Get revies belonging to dish
		return new Promise(function(resolve, reject) {
			revRef.orderByKey().once('value', function(snapshot) {
				var revList = snapshot.val()
				//console.log("2");
				//console.log(snapshot.val())
				
				for (var key in revList) {
					if (revList.hasOwnProperty(key) && key==dishId) {
						for(var subkey in revList[key]){
							var revObject = {
								name: revList[key][subkey]["reviewer_name"],
								title: revList[key][subkey]["title"],
								id: revList[key][subkey]["reviewer_UID"],
								body: revList[key][subkey]["body"],
								rating: revList[key][subkey]["rating"]
							}
							console.log(revObject);
							dishReviews.push(revObject);
						}
					}
				}
				
				resolve()
			})
		})
		
		
	}).then(function() {
		//console.log("HELLOOOOOO");
		//console.log(dishReviews);
		res.renderT('dish', {
				template: 'dish',
				dish: dishData,
				user: req.user,
				reviews: dishReviews
			})
	})
	
	
	//Sveta
	//Dish: Reviews
	/*
	var rev=req.params.dish;
	console.log(rev);
	var dishReviews = [];
	var refRev = db.ref("Dishes");
	console.log("Hello"+rev);
	
	refRev.orderByKey().on("child_added", function (snapshot){
		db.ref("Reviews/" + rev).orderByChild("name").on("child_added", function(snapshot){
	 		dishreviews.push({name: snapshot.val().reviewer_name, title: snapshot.val().title, body:snapshot.val().body, rating:snapshot.val().rating});
		});
	});

	
	res.renderT('dish', {
	 	template: 'dish',
	 	reviews : dishReviews,
	 	user: req.user
	});
	*/
}


module.exports.profile = function(req, res) {
	var session = req.session
	var user = req.user
  console.log(user)
  	
	var profile;
	var favdisheskeys= [];
	var favdishes=[];
	var favreskeys=[];
	var favres=[];
	
	var userRef = db.ref("Users")
	
	if(req.user == null || req.user == "") {
		return res.redirect("/")
	}
	
	userRef.orderByKey().equalTo(user).once("value", function(snapshot) {
		profile = {
			name: snapshot.val()[user]["name"],
			location: snapshot.val()[user]["general_location"],
			savedDishes: snapshot.val()[user]["SavedDishes"],
			savedRestaurants: snapshot.val()[user]["SavedRestaurants"]
		}
		console.log(profile)
	}).then(function() {
		//Favorite Dishes
		for (var key in profile.savedDishes) {
			if(profile.savedDishes[key]){
				favdisheskeys.push(key);
			}
		}
		for(var i=0; i<favdisheskeys.length; i++) {
			refDishes.orderByKey().equalTo(favdisheskeys[i]).on("child_added", function (snapshot) {
				favdishes.push({
					name: snapshot.val().name,
					desc: snapshot.val().food_description,
					img:snapshot.val().thumbnail_URL,
					key: snapshot.key,
					resname: snapshot.val().restaurant_name,
					rating: snapshot.val().averageRating,
					numrating: snapshot.val().number_of_ratings,
				});
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
				favres.push({name: snapshot.val().name, address: snapshot.val().address, key: snapshot.key});
			});
		}
	}).then(function() {
			res.renderT('profile', {
			template: 'profile',
			user: req.user,
			profile: profile,
			favdishes: favdishes,
			favres: favres
		})
	})
	
	
	// for(var i=0; i<profiles.length; i++){
	// 	if (profiles[i].key == req.user){
	// 		profile = {
	// 			name: profiles[i].name,
	// 			location: profiles[i].location,
	// 			savedDishes: profiles[i].savedDishes,
	// 			savedRestaurants: profiles[i].savedRestaurants
	// 		};
	// 		console.assert(profile);
	// 	}
	// }
	

}

module.exports.editprofile = function(req, res) {
	
	res.renderT('editprofile', {
		template: 'editprofile',
		user: req.user
	})
}

module.exports.results = function(req, res) {
	var results = [];
	if(req.query!=null){
	   var searchType = req.query.type;
	    var searchQuery = req.query.query;
	    console.log(searchQuery);
	    console.log(searchType);
	    if(searchType == "Dishes"){
	      var ref = db.ref("Dishes");
	      ref.orderByChild("name").startAt(searchQuery).endAt(searchQuery+"\uf8ff").on("child_added", function(snapshot) {
	   		var result = {name: snapshot.val().name, desc: snapshot.val().food_description};
	   		results.push(result);
	      });
	      console.log(results);
	    }else if(searchType == "Restaurants"){
	       var ref = db.ref("Restaurants");
	       ref.orderByChild("name").startAt(searchQuery).endAt(searchQuery+"\uf8ff").on("child_added", function(snapshot) {
	       	 var result = {name:snapshot.val().name, desc: snapshot.val().address};
	       	 results.push(result);
	       });
	       console.log(results);
	    }
	}
	
	res.renderT('results', {
		template: 'results',
		results: results,
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
	var restaurantId = req.params.restaurant

	console.log("RESTAURANT: "+restaurantId)

	var restaurantRef = db.ref("Restaurants")
	var dishRef = db.ref("Dishes")
	var restaurantData
	var restaurantDishes = []
	
	
	
	restaurantRef.once('value', function(snapshot) {
		if(snapshot.hasChild(restaurantId)) {
			restaurantData = snapshot.val()[restaurantId]
			console.log(restaurantData)
			
		} else {
			res.redirect("/")
		}
	}).then(function() {
		// Get dishes belonging to restaurant
		return new Promise(function(resolve, reject) {
			dishRef.orderByChild("restaurant").equalTo(restaurantId).once('value', function(snapshot) {
				var dishList = snapshot.val()
				console.log(snapshot.val())
				
				for (var key in dishList) {
					if (dishList.hasOwnProperty(key)) {
						var dishObject = {
							name: dishList[key]["name"],
							img: dishList[key]["thumbnail_URL"],
							key: key,
							desc: dishList[key]["food_description"]
						}
						restaurantDishes.push(dishObject)
					}
				}
				
				resolve()
			})
		})
		
		
	}).then(function() {
		res.renderT('restaurant', {
				template: 'restaurant',
				restaurant: restaurantData,
				user: req.user,
				dishes: restaurantDishes
			})
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
var hotdishes = [];
var dish;
refDishes.orderByChild("averageRating").limitToFirst(10).on("child_added", function (snapshot) {
	dish = {name: snapshot.val().name, desc: snapshot.val().food_description, key: snapshot.key, img: snapshot.val().thumbnail_URL};
	hotdishes.push(dish);
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