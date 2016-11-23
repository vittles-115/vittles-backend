$(document).ready(function() {
	var searchType = "none";
	
	$("#s1, #s2, #s3, #s4, #s5").click(function(event) {
		$("#reviewheader").css("display", "none");
		$("#top-divider").css("display", "none");
		$("#bottom-divider").css("display","block");
		$("#onpage-reviewpost").css("display","block");
		$("#onpage-reviewtitle").css("display","block");
		$("#reviewbox").css("width","800px");
		$(".extraspace").css("display","block");
		$("#submitrev").css("display","block");
	})
	
	/*
	$("#restToggle").click(function(event) {

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
	});*/


})