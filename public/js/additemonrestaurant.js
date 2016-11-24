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
		$(".extraspace").css("display","block");
	})


})