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
		template: 'additem'
	})
}