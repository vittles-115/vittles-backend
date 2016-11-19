$(document).ready(function() {
	
	$("#dishToggle").click(function(event) {
		searchType = $(this).attr('val')

		if($("#query").val() == "") {
			alert("Enter a valid search")
			return
		}
		
		var params = {
			type: searchType,
			query: $("#query").val()
		}
		
		window.location.href = "/search?type="+params.type+"&query="+params.query
	})
	
		$("#restToggle").click(function(event) {
		searchType = $(this).attr('val')

		if($("#query").val() == "") {
			alert("Enter a valid search")
			return
		}
		
		var params = {
			type: searchType,
			query: $("#query").val()
		}
		
		window.location.href = "/search?type="+params.type+"&query="+params.query
	})


})