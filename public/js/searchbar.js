$(document).ready(function() {
	var searchType = "none";
	
	//If Dish is chosen from menu, display it and search on it
	$("#dishToggle").click(function(event) {
		searchType = $(this).attr("val")
		$("#icon").css("display", "none")
		$("#dishDrop").css("display", "inline")
		$("#restDrop").css("display", "none")
		$("#dropdownMenu").css("width", "100px")
	})
	
	//If restuarnat is chosen from menu, display it and search on it
	$("#restToggle").click(function(event) {
		searchType = $(this).attr('val')
		$("#icon").css("display", "none")
		$("#dishDrop").css("display", "none")
		$("#restDrop").css("display", "inline")
		$("#dropdownMenu").css("width", "150px")
	})
	
	//perform search when enter is hit
	$("#query").keypress(function (e) {
		if (e.which == 13) {
			if($("#query").val() == "") {
				alert("Enter a valid search")
				return
			}
		  	var params = {
				type: searchType,
				query: $("#query").val()
			}
			//redirect w/ apropriate params
			window.location.href = "/search?type="+params.type+"&query="+params.query
		}
	});


})