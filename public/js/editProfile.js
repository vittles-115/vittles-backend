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


  		if (imageUpdate != null && imageUpdate != "") {
  			console.log("Image present")
  			profileImageRef.put(imageUpdate).then(function() {
  				console.log("storage updated")
  				linkProfileImage(userRef, profileImageRef)
  				
  				

  			})
  			
  		}

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



	// Create a reference to 'mountains.jpg'
	// var mountainsRef = storageRef.child('mountains.jpg');

	// // Create a reference to 'images/mountains.jpg'
	// var mountainImagesRef = storageRef.child('images/mountains.jpg');

	// // While the file names are the same, the references point to different files
	// mountainsRef.name === mountainImagesRef.name            // true
	// mountainsRef.fullPath === mountainImagesRef.fullPath    // false

