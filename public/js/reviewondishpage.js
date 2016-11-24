$(document).ready(function() {
	
	//If any of the stars are clicked open review form
	$("#s1, #s2, #s3, #s4, #s5").click(function(event) {
		$("#reviewheader").css("display", "none");
		$("#top-divider").css("display", "none");
		$("#bottom-divider").css("display","block");
		$("#onpage-reviewpost").css("display","block");
		$("#onpage-reviewtitle").css("display","block");
		$("#closereview").css("display","block");
		$("#reviewbox").css("width","800px");
		$(".extraspace").css("display","block");
		$("#submitrev").css("display","block");
	})
	
	//If x is clicked close review form
	$("#closereview").click(function(event) {
		$("#reviewheader").css("display", "block");
		$("#top-divider").css("display", "block");
		$("#bottom-divider").css("display","none");
		$("#onpage-reviewpost").css("display","none");
		$("#onpage-reviewtitle").css("display","none");
		$("#closereview").css("display","none");
		$("#reviewbox").css("width","400px");
		$(".extraspace").css("display","none");
		$("#submitrev").css("display","none");
	})


})