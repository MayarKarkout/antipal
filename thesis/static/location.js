function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }

    function showPosition(position) {

        const Url = "http://api.geonames.org/findNearbyPlaceNameJSON?lat="
            + position.coords.latitude
            + "&lng="
            + position.coords.longitude
            + "&username=mayar"
            + "&cities=cities15000"

        fetch(Url)
        .then(response => response.json())
        .then(data=>{
            document.getElementById("city_field").value = data.geonames[0].toponymName;
            document.getElementById("country_field").value = data.geonames[0].countryName;
            $("#form3").submit();
        })
    }
}

function submitDetailsForm(lat, lan) {


    }

//$(document).ready(function() {
    // hide the forms when page is ready
//    $('#form1').hide();
//    $('#form2').hide();
//
//    $('#butt1').click(function(){
//        $('#form2').hide();
//        $('#form1').show();
//
//    });
//    $('#butt2').click(function(){
//        $('#form1').hide();
//        $('#form2').show();
//    });
//});