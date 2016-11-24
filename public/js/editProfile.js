firebase.auth().onAuthStateChanged(function(user) {
  if (user) {

  	// Create a root reference
  	var currentUser = firebase.auth().currentUser.uid
  	var storageRef = firebase.storage().ref()
  	var userRef = firebase.database().ref("Users/"+currentUser)
  	var profileImageRef = storageRef.child("thumbnailSized/Users/" + currentUser + "/profile_small.jpg")


  	$("#submitProfileUpdate").click(function(event) {
  		event.preventDefault()
  		$("#submitProfileUpdate").attr("disabled", true)

  		var nameUpdate = $("[name='editusername']").val()
  		var locationUpdate = $("[name='edituserlocation']").val()
  		var imageUpdate = document.querySelector("[name='userimg']").files[0]

			userRef.update({
				"name" : nameUpdate,
				"general_location": locationUpdate
			}).then(function() {
				console.log("name/location updated")
				
				if (imageUpdate != null && imageUpdate != "") {
					console.log("Image present")
					profileImageRef.put(imageUpdate).then(function() {
						console.log("storage updated")
						linkProfileImage(userRef, profileImageRef)
					})

				} else {
					window.location.reload()
				}
			})

  	})	
  	
  	
    // User is signed in.
  } else {
    // No user is signed in.
  }
  
  function linkProfileImage(userRef, profileImageRef) {
		profileImageRef.getDownloadURL().then(function(imgURL) {
			console.log(imgURL)
			userRef.child("thumbnail_URL").set(imgURL)
  				.then(function() {
  					window.location.reload()
  				}).catch(function(err) {
			  		$("#submitProfileUpdate").attr("disabled", false)
  				})
		})

  }
  
})


