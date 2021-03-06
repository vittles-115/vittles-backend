const firebase = require("firebase")
const db = firebase.database()



module.exports.index = function(req, res) {
	var session = req.session
	var user = req.user
	var dish
	var restaurant
	var userFav
	var favdisheskeys = []
	var favreskeys = []
	var dishes = []
	var restaurants = []
	var userRef = db.ref("Users")
	
	//If user is not logged in
	if (user == null || user == '') {
		//Gets 10 highest rated dishes from database.
		refDishes.orderByChild("averageRating").limitToLast(10).on("child_added", function(snapshot) {
			dish = {
				name: snapshot.val().name,
				desc: snapshot.val().food_description,
				key: snapshot.key,
				img: snapshot.val().thumbnail_URL,
				resname: snapshot.val().restaurant_name,
				rating: snapshot.val().averageRating,
				numrating: snapshot.val().number_of_ratings,
				saved: false
			};
			dishes.push(dish);
		});
		//Gets 10 restaurants from database.
		refRes.orderByChild("name").limitToFirst(10).on("child_added", function(snapshot) {
			restaurant = {
				name: snapshot.val().name,
				address: snapshot.val().address,
				key: snapshot.key,
				titles: snapshot.val().menu_titles,
				img: snapshot.val().thumbnail_URL,
				saved: false
			};
			restaurants.push(restaurant);
		});
		res.renderT('index', {
			template: 'index',
			dishes: dishes,
			restaurants: restaurants,
			user: req.user
		})
	} else {
		//If user is logged in
		//Get users Favorite Dishes/Restaurants
		userRef.orderByKey().equalTo(user).once("value", function(snapshot) {
			userFav = {
				savedDishes: snapshot.val()[user]["SavedDishes"],
				savedRestaurants: snapshot.val()[user]["SavedRestaurants"]
			}
		}).then(function() {
			//User Favorite Dishes
			for (var key in userFav.savedDishes) {
				if (userFav.savedDishes[key]) {
					favdisheskeys.push(key);
				}
			}

			//For the top 10 dishes, color red if it is users' favorites
			refDishes.orderByChild("averageRating").limitToLast(10).on("child_added", function(snapshot) {
				//If there is no dishes favorites
				if (favdisheskeys.length == 0) {
					dish = {
						name: snapshot.val().name,
						desc: snapshot.val().food_description,
						key: snapshot.key,
						img: snapshot.val().thumbnail_URL,
						resname: snapshot.val().restaurant_name,
						rating: snapshot.val().averageRating,
						numrating: snapshot.val().number_of_ratings,
						saved: false
					};
				}
				//If dish is one of user's favorites, have saved be true
				for (var i = 0; i < favdisheskeys.length; i++) {
					if (favdisheskeys[i] == snapshot.key) {
						dish = {
							name: snapshot.val().name,
							desc: snapshot.val().food_description,
							key: snapshot.key,
							img: snapshot.val().thumbnail_URL,
							resname: snapshot.val().restaurant_name,
							rating: snapshot.val().averageRating,
							numrating: snapshot.val().number_of_ratings,
							saved: true
						};
						break;
					}
					else {
						dish = {
							name: snapshot.val().name,
							desc: snapshot.val().food_description,
							key: snapshot.key,
							img: snapshot.val().thumbnail_URL,
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
				if (userFav.savedRestaurants[key]) {
					favreskeys.push(key);
				}
			}
			//For the top 10 restaurants, color red if it is users' favorites
			refRes.orderByChild("name").limitToFirst(10).on("child_added", function(snapshot) {
				//If there is no restaurant favorites
				if (favreskeys.length == 0) {
					restaurant = {
						name: snapshot.val().name,
						address: snapshot.val().address,
						key: snapshot.key,
						titles: snapshot.val().menu_titles,
						img: snapshot.val().thumbnail_URL,
						saved: false
					};
				}
				//if restaurants is one of user's favorites, have saved be true
				for (var i = 0; i < favreskeys.length; i++) {
					if (favreskeys[i] == snapshot.key) {
						restaurant = {
							name: snapshot.val().name,
							address: snapshot.val().address,
							key: snapshot.key,
							titles: snapshot.val().menu_titles,
							img: snapshot.val().thumbnail_URL,
							saved: true
						};
						break;
					}
					else {
						restaurant = {
							name: snapshot.val().name,
							address: snapshot.val().address,
							key: snapshot.key,
							titles: snapshot.val().menu_titles,
							img: snapshot.val().thumbnail_URL,
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
				user: req.user
			})
		})
	}
}


module.exports.dish = function(req, res) {
	var dishId = req.params.dish;


	var dishRef = db.ref("Dishes");
	var revRef = db.ref("Reviews");
	var userRef = db.ref("Users")
	var dishData;
	var dishReviews = [];

	dishRef.once('value', function(snapshot) {

		if (snapshot.hasChild(dishId)) {
			dishsnapshot = snapshot.val()[dishId];
			dishData = {
				name: dishsnapshot["name"],
				rating: dishsnapshot["averageRating"],
				desc: dishsnapshot["food_description"],
				restaurant: dishsnapshot["restaurant_name"],
				restaurant_id: dishsnapshot["restaurant"],
				img: dishsnapshot["thumbnail_URL"],
				numrating: dishsnapshot["number_of_ratings"]
			}
		}
		else {
			res.redirect("/")
		}
	}).then(function() {
		// Get reviews belonging to dish
		return new Promise(function(resolve, reject) {
			revRef.orderByKey().once('value', function(snapshot) {
				var revList = snapshot.val()
				for (var key in revList) {
					if (revList.hasOwnProperty(key) && key == dishId) {
						for (var subkey in revList[key]) {
							
							
							
							var revObject = {
									key: subkey,
									name: revList[key][subkey]["reviewer_name"],
									title: revList[key][subkey]["title"],
									id: revList[key][subkey]["reviewer_UID"],
									body: revList[key][subkey]["body"],
									rating: revList[key][subkey]["rating"]
								}
							dishReviews.push(revObject);
						}
					}
				}

				resolve()
			})
		})


	}).then(function() {
		// var visitedUsers = []
		
		// for(var i = 0; i < dishReviews.length; i++) {
		// 	if(visitedUsers.indexOf(dishReviews[i].id) == -1) {
		// 		visitedUsers.push(dishReviews[i].id)
		// 	}
		// }
		
		return userRef.once("value", function(snapshot) {
			// console.log(snapshot.val())
			
		    for(var j = 0; j < dishReviews.length; j++) {
		    	var currentUser = dishReviews[j]["id"]
		    	
		    	if(snapshot.val()[currentUser] != null) {
		    		// console.log(snapshot.val()[currentUser]["thumbnail_URL"])
		    		
		    		dishReviews[j].img = snapshot.val()[currentUser]["thumbnail_URL"]
		    	}
		    	
		    	
		    	// 
		    }
		})
		
		
	}).then(function() {
		res.renderT('dish', {
			template: 'dish',
			dish: dishData,
			req: req,
			user: req.user,
			reviews: dishReviews
		})
	})
}


module.exports.profile = function(req, res) {
	var session = req.session
	var user = req.user
	var profile;
	var favdisheskeys = [];
	var favdishes = [];
	var favreskeys = [];
	var favres = [];
	var userRef = db.ref("Users")
	//If user is not logged in, the user is not able to see this page
	if (req.user == null || req.user == "") {
		return res.redirect("/")
	}
	
	//Get user information from database
	userRef.orderByKey().equalTo(user).once("value", function(snapshot) {
		profile = {
			name: snapshot.val()[user]["name"],
			location: snapshot.val()[user]["general_location"],
			savedDishes: snapshot.val()[user]["SavedDishes"],
			savedRestaurants: snapshot.val()[user]["SavedRestaurants"],
			img: snapshot.val()[user]["thumbnail_URL"]
		}
	}).then(function() {
		//Gets keys of user's favorite dishes
		for (var key in profile.savedDishes) {
			if (profile.savedDishes[key]) {
				favdisheskeys.push(key);
			}
		}
		//Gets user's favorite dishes from database
		for (var i = 0; i < favdisheskeys.length; i++) {
			refDishes.orderByKey().equalTo(favdisheskeys[i]).on("child_added", function(snapshot) {
				favdishes.push({
					name: snapshot.val().name,
					desc: snapshot.val().food_description,
					img: snapshot.val().thumbnail_URL,
					key: snapshot.key,
					resname: snapshot.val().restaurant_name,
					rating: snapshot.val().averageRating,
					numrating: snapshot.val().number_of_ratings,
				});
			});
		}

		//Gets keys of user's favorite restaurants
		for (var key in profile.savedRestaurants) {
			if (profile.savedRestaurants[key]) {
				favreskeys.push(key);
			}
		}
		//Gets user's favorite restaurants from database
		for (var i = 0; i < favreskeys.length; i++) {
			refRes.orderByKey().equalTo(favreskeys[i]).on("child_added", function(snapshot) {
				favres.push({
					name: snapshot.val().name,
					address: snapshot.val().address,
					key: snapshot.key
				});
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

}

module.exports.editprofile = function(req, res) {

	var session = req.session
	var user = req.user
	var profile;
	var userRef = db.ref("Users")
	//If user is not logged in, the user is not able to see this page
	if (req.user == null || req.user == "") {
		return res.redirect("/")
	}
	
	//Gets logged in user's information
	userRef.orderByKey().equalTo(user).once("value", function(snapshot) {
		profile = {
			name: snapshot.val()[user]["name"],
			location: snapshot.val()[user]["general_location"],
			savedDishes: snapshot.val()[user]["SavedDishes"],
			savedRestaurants: snapshot.val()[user]["SavedRestaurants"],
			img: snapshot.val()[user]["thumbnail_URL"]
		}
	})

	res.renderT('editprofile', {
		template: 'editprofile',
		user: req.user,
		userInfo: profile
	})
}

module.exports.results = function(req, res) {
	var results = [];
	if (req.query != null) {
		//Get the search information from req
		var searchType = req.query.type;
		var searchQuery = req.query.query;
		//code to capitalize the first letter of every word, everything else should be lowercase
		searchQuery = searchQuery.toLowerCase();
		searchQuery = searchQuery.replace(/\w\S*/g, function(txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
		//This finds dishes that start with the characters signified by search query for dishes
		if (searchType == "Dishes") {
			var ref = db.ref("Dishes");
			ref.orderByChild("name").startAt(searchQuery).endAt(searchQuery + "").on("child_added", function(snapshot) {
				var result = {
					id: snapshot.key,
					type: "dish",
					name: snapshot.val().name,
					desc: snapshot.val().food_description,
					img: snapshot.val().thumbnail_URL,
					link: snapshot.val().restaurant,
					link_name: snapshot.val().restaurant_name
				};
				results.push(result);
			});
		}
		//This finds dishes that start with the characters signified by search query for dishes
		else if (searchType == "Restaurants") {
			var ref = db.ref("Restaurants");
			ref.orderByChild("name").startAt(searchQuery).endAt(searchQuery + "").on("child_added", function(snapshot) {
				var result = {
					id: snapshot.key,
					type: "restaurant",
					name: snapshot.val().name,
					desc: snapshot.val().address,
					img: snapshot.val().thumbnail_URL,
					link: "null",
					link_name: "null"
				};
				results.push(result);
			});
			//console.log(results);
		}
		//If type not specified, search performed on dishes+restaurants
		else {
			var ref = db.ref("Dishes");
			ref.orderByChild("name").startAt(searchQuery).endAt(searchQuery + "").on("child_added", function(snapshot) {
				var result = {
					id: snapshot.key,
					type: "dish",
					name: snapshot.val().name,
					desc: snapshot.val().food_description,
					img: snapshot.val().thumbnail_URL,
					link: snapshot.val().restaurant,
					link_name: snapshot.val().restaurant_name
				};
				results.push(result);
			});
			var ref = db.ref("Restaurants");
			ref.orderByChild("name").startAt(searchQuery).endAt(searchQuery + "").on("child_added", function(snapshot) {
				var result = {
					id: snapshot.key,
					type: "restaurant",
					name: snapshot.val().name,
					desc: snapshot.val().address,
					img: snapshot.val().thumbnail_URL,
					link: "null",
					link_name: "null"
				};
				results.push(result);
			});
		}
	}

	res.renderT('results', {
		template: 'results',
		results: results,
		user: req.user
	})

}

module.exports.writereview = function(req, res) {
	var revdishes = [];
	var revdish;
	//Gets dishes' names that users can choose from using dropdown menu
	refDishes.orderByChild("name").on("child_added", function (snapshot) {
		revdish = {name: snapshot.val().name, restaurant_name: snapshot.val().restaurant_name};
		revdishes.push(revdish);
	});
	res.renderT('writereview', {
		template: 'writereview',
		restaurants: restaurants,
		dishes: revdishes,
		user: req.user
	})
}

module.exports.restaurant = function(req, res) {
	var restaurantId = req.params.restaurant

	if (restaurantId == null || restaurantId == "") {
		return res.redirect('/')
	}
	
	//Initialized variables for loading restaurant page
	var restaurantRef = db.ref("Restaurants")
	var dishRef = db.ref("Dishes")
	var restaurantData
	var restaurantDishes = []
	var star_rating = 0;
	var dish_count = 0;
	var num_ratings = 0;
	var avg_star_rating;

	restaurantRef.once('value', function(snapshot) {
		if (snapshot.hasChild(restaurantId)) {
			var restRef = snapshot.val()[restaurantId];
			var average_dish_rating;

			dishRef.orderByChild("restaurant").equalTo(restaurantId).once('value', function(snapshot) {
				var dishList = snapshot.val()

				for (var key in dishList) {
					//find the average star rating for that restaurant
					if (dishList.hasOwnProperty(key)) {
						star_rating += dishList[key]["averageRating"];
						dish_count++;
						num_ratings += dishList[key]["number_of_ratings"];
					}
				}

				avg_star_rating = star_rating / dish_count;

			})
			//get the restaurant data 
			restaurantData = {
				key: restaurantId,
				name: restRef["name"],
				address: restRef["address"],
				avgdishrating: avg_star_rating,
				numrating: num_ratings,
				img: restRef["thumbnail_URL"]
			}

		}
		else {
			res.redirect("/")
		}
	}).then(function() {
		// Get dishes belonging to restaurant
		return new Promise(function(resolve, reject) {
			dishRef.orderByChild("restaurant").equalTo(restaurantId).once('value', function(snapshot) {
				var dishList = snapshot.val()
				//get the dish data for the restaurant
				for (var key in dishList) {
					if (dishList.hasOwnProperty(key)) {
						var dishObject = {
							name: dishList[key]["name"],
							img: dishList[key]["thumbnail_URL"],
							rating: dishList[key]["averageRating"],
							numrating: dishList[key]["number_of_ratings"],
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
		//console.log(restaurantData);
		//render restaurant page
		res.renderT('restaurant', {
			types: types,
			template: 'restaurant',
			restaurant: restaurantData,
			user: req.user,
			dishes: restaurantDishes
		})
	})

}

module.exports.additem = function(req, res) {

	res.renderT('additem', {
		template: 'additem',
		types: types,
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
var refDishes = db.ref("Dishes");
var types = [];
var firstItem = true;
var prevtype;
refDishes.orderByChild("type").on("child_added", function(snapshot) {
	var type = snapshot.val().type;
	if (type != prevtype || firstItem) {
		types.push({
			type: type
		});
		firstItem = false;
	}
	prevtype = type;
});

//Add Item Restaurants
var restaurants = [];
var restaurant;
var refRes = db.ref("Restaurants");
refRes.orderByChild("name").on("child_added", function(snapshot) {
	restaurant = {
		name: snapshot.val().name
	};
	restaurants.push(restaurant);
});

//Sveta
//Add Item Reviews
var reviews = [];
var review;
var refRev = db.ref("Reviews");
refRev.orderByChild("name").on("child_added", function(snapshot) {
	review = {
		name: snapshot.val().name
	};
	reviews.push(review);
});



