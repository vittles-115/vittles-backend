// Create a root reference
var currentUser = firebase.auth().currentUser.uid
var storageRef = firebase.storage().ref();
var profileImageRef = storageRef.child("thumbnailSized/Users/"+currentUser+"/profile_small.jpg")


$("#submitProfileUpdate").click(function(event) {
	event.preventDefault()
	$("#submitProfileUpdate").attr("disabled", true)
	
	var nameUpdate = $("[name='editusername']").val()
	var locationUpdate = $("[name='edituserlocation']").val()
	var imageUpdate = $("[name='userimg']").val()
	

	if(imageUpdate != null && imageUpdate != "") {
		profileImageRef.put
	}
	
})


// Create a reference to 'mountains.jpg'
// var mountainsRef = storageRef.child('mountains.jpg');

// // Create a reference to 'images/mountains.jpg'
// var mountainImagesRef = storageRef.child('images/mountains.jpg');

// // While the file names are the same, the references point to different files
// mountainsRef.name === mountainImagesRef.name            // true
// mountainsRef.fullPath === mountainImagesRef.fullPath    // false

