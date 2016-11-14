$(document).ready(function() {
	
	if(firebase.auth().currentUser != null) {
		console.log("user logged in");	
	} else {
		console.log("no user")
	}
	
	
	var standardError = "Please fill out all forms with valid information"
	
	$("#signIn").click(function(event) {
		showStatus()
		firebase.auth().signInWithEmailAndPassword($("[name='useremail']").val(), $("[name='userpassword']").val())
			.then(function() {
				var userProps = {
					user: firebase.auth().currentUser.uid
				}
				
				$.post('/validateUser', userProps, function(response) {
					console.log(response)
					window.location.href = "/"
				}).fail(function(error) {
					console.log(error.message)
					showError()
				})
			})
			.catch(function(error) {
				hideStatus()
				var errorMessage = error.message;
				$(".errorMessage").text(errorMessage);
				showError();
				console.log(error);
			})
	})
	
	$("#signUp").click(function(event) {
		var isValid = validateForm()
		if (isValid == true) {
			showStatus()
			
			firebase.auth().createUserWithEmailAndPassword($("[name='useremail']").val(), $("[name='userpassword']").val())
				.then(function() {
					hideStatus();
					console.log(firebase.auth().currentUser.uid)
					
					var userProps = {
						user: firebase.auth().currentUser.uid,
						name: $("[name='username']").val(),
						location: $("[name='userlocation']").val()
					}
					
					$.post('/newUser', userProps, function(response) {
						window.location.href = "/profile"
					}).fail(function(error){
						console.log(error.message)
						$(".errorMessage").text("Something went wrong... Please wait and try again")
						showError()
					})
					
				})
				.catch(function(error) {
					hideStatus();
					var errorCode = error.code;
					var errorMessage = error.message;
					if (errorCode == 'auth/weak-password') {
						$(".errorMessage").text("The password is too weak")
					}
					else {
						$(".errorMessage").text(errorMessage);
					}
					showError();
					console.log(error);
				})
			
			console.log("valid form")
		}
	})

	$(".form-control").change(function(event) {
		$(".form-control").parent().removeClass("has-error")
		hideError()
	})

	function validateForm() {
		var isValid = true;
		$('.registerForm').each(function() {
			if ($(this).val() == '') {
				isValid = false;
				$(this).parent().addClass("has-error")
			}

			if ($(this).attr("name") == "useremail") {
				if (isEmail($(this).val()) == false) {
					isValid = false;
					$(this).parent().addClass("has-error")
				}
			}
		});
		
		if (isValid == false) {
			showError()
		}
		
		
		console.log(isValid)
		return isValid;
	}

	function isEmail(email) {
		var emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
		return emailReg.test(email);
	}
	
	function showError() {
		$(".errorMessage").css({
				"height": "30px",
				"opacity": "1"
		})
	}
	
	function hideError() {
		$(".errorMessage").css({
			"height": "0px",
			"opacity": "0"
		})
	}
	
	function showStatus() {
		$(".statusMessage").css({
				"height": "30px",
				"opacity": "1"
		})
	}
	
	function hideStatus() {
		$(".statusMessage").css({
				"height": "0px",
				"opacity": "0"
		})
	}

})