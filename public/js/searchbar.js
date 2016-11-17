$(document).ready(function() {
	var searchType = "Dishes"
	
	$(".searchToggle").click(function(event) {
		searchType = $(this).attr('id')
	})
	
	
	$("#sendSearch").click(function(event) {
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