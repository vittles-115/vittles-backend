$(document).ready(function() {
	var searchType = "none";
	
	$("#dishToggle").click(function(event) {
		searchType = $(this).attr("val")
		$("#icon").css("display", "none")
		$("#dishDrop").css("display", "inline")
		$("#restDrop").css("display", "none")
		$("#dropdownMenu").css("width", "100px")
	})
	
	$("#restToggle").click(function(event) {
		searchType = $(this).attr('val')
		$("#icon").css("display", "none")
		$("#dishDrop").css("display", "none")
		$("#restDrop").css("display", "inline")
		$("#dropdownMenu").css("width", "150px")
	})
	
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
			window.location.href = "/search?type="+params.type+"&query="+params.query
		}
	});


})