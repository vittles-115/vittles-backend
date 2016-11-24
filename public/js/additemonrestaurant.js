$(document).ready(function() {
	
	  $(".myselect").select2({
        placeholder: "Choose a category"
    });
    
	
	$("#add-item").click(function(event) {
		$("#additemheader").css("display", "none");
		$("#top-divider").css("display", "none");
		$("#add-item").css("display","none");
		$("#categorylist").css("display","block");
		$("#onpage-adddishname").css("display","block");
		$("#onpage-adddishdesc").css("display","block");
		$("#addimglabel").css("display","block");
		$("#additem").css("display","block");
		$("#reviewbox").css("width","800px");
		$("#closeadditem").css("display", "block");
		$(".extraspace").css("display","block");
	})

	$("#closeadditem").click(function(event) {
		$("#additemheader").css("display", "block");
		$("#top-divider").css("display", "block");
		$("#add-item").css("display","block");
		$("#categorylist").css("display","none");
		$("#onpage-adddishname").css("display","none");
		$("#onpage-adddishdesc").css("display","none");
		$("#addimglabel").css("display","none");
		$("#additem").css("display","none");
		$("#closeadditem").css("display", "none");
		$("#reviewbox").css("width","400px");
		$(".extraspace").css("display","none");
	})


})