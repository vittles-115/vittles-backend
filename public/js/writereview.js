//Basic Select2 functionality
$(document).ready(function() {
    $(".selectRestaurant").select2({
        placeholder: "Choose a restaurant"
    });
    
    $(".selectDish").select2({
        placeholder: "Choose a dish"
    });

    $(".selectRestaurant").change(function() {
        var params = {
            user: firebase.auth().currentUser.uid,
            restaurant: $(".selectRestaurant").val()
        }

        $.get('/getReviewData', params, function(data) {
            console.log(data)
            
            $(".selectDish").select2('destroy').empty().select2({data: data.dishes, placeholder: "Choose a dish"})

        }).fail(function(error) {
            alert(error)
        })
    })

});