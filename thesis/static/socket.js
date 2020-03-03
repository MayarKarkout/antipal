var socket = io.connect('http://' + document.domain + ':' + location.port);
  socket.on( 'connect', function() {
    socket.emit( 'my event', {
      data: 'User Connected'
    } )
    var form = $( 'form' ).on( 'submit', function( e ) {
      e.preventDefault()
      let user_name = $( 'input.username' ).val()
      let user_input = $( 'input.message' ).val()
      socket.emit( 'my event', {
        user_name : user_name,
        message : user_input
      } )
      $( 'input.message' ).val( '' ).focus()
    } )
  } )
  socket.on( 'my response', function( msg ) {
    console.log( msg )
    if( typeof msg.user_name !== 'undefined' ) {
      $( 'h3' ).remove()
      $( 'div.message_holder' ).append( '<div><b style="color: #000">'+msg.user_name+'</b> '+msg.message+'</div>' )
    }
  })

function find_friend() {
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
    } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
    }

    function showPosition(position) {

        var lat = position.coords.latitude.toString();
        var lon = position.coords.longitude.toString();

//        lat = 31.705086.toString();
//        lon = 35.231119.toString();

        if(lat.charAt(0) === '-') {
            lat = lat.substr(1);
        }
        else {
            lat = '-' + lat;
        }

        if(lon.charAt(0) === '-') {
            lon = 180 + lon;
        } else {
            lon = lon - 180;
        }

//        document.getElementById("city_field").value = "Dunedin";
//        document.getElementById("country_field").value = "New Zealand";
//        document.getElementById("find_friend_form").submit();
//        return 0;



        const Url = makeApiRequestUrl(lat,lon)
        fetch(Url)
        .then(response => response.json())
        .then(data=>{
            if (data.geonames === undefined || data.geonames.length == 0) {
                console.dir("hey");
                findNearestPlace(Number(lat), Number(lon), 1)
            }
            else{
                document.getElementById("city_field").value = data.geonames[0].name;
                document.getElementById("country_field").value = data.geonames[0].countryName;
//                document.getElementById("find_friend_form").submit();
                console.dir(data.geonames[0]);
            }
        })
    }
}

async function findNearestPlace(lat, lon, rep){

//  300km is the max radius of API request parameter
//  300km ~= 2.7 degrees latitude
//  1 degree longitude ~= 111.320*cos(latitude) km
//  300km in longitude degrees = 300km / 1 degree longitude in km
    var degree_lon_in_km = 111.32*Math.cos(lat * Math.PI / 180);

    var x = rep;
    var y = 0;
    var data_sets = [];

    while (x != 0){
        lat_request = lat + 2.7*x;
        degree_lon_in_km = 111.32*Math.cos(lat_request * Math.PI / 180);
        lon_request = lon + (300/degree_lon_in_km)*y;
        if (lon_request > 180 || lon_request < -180){
            lon_request = -1*lon_request;
            if(Math.sign(lon_request) == 1)
             lon_request = lon_request - (2*(lon_request - 180));
            else
             lon_request = lon_request + (2*(Math.abs(lon_request) - 180));
        }

        const Url = makeApiRequestUrl(lat_request, lon_request);
        data_sets.push(await fetchReturnsData(Url));
        x--;
        y++;
    }
    while (y != 0){
        lat_request = lat + 2.7*x;
        degree_lon_in_km = 111.32*Math.cos(lat_request * Math.PI / 180);
        lon_request = lon + (300/degree_lon_in_km)*y;
        if (lon_request > 180 || lon_request < -180){
            lon_request = -1*lon_request;
            if(Math.sign(lon_request) == 1)
             lon_request = lon_request - (2*(lon_request - 180));
            else
             lon_request = lon_request + (2*(Math.abs(lon_request) - 180));
        }

        const Url = makeApiRequestUrl(lat_request, lon_request);
        data_sets.push(await fetchReturnsData(Url));
        x--;
        y--;
    }
    while (x != 0){
        lat_request = lat + 2.7*x;
        degree_lon_in_km = 111.32*Math.cos(lat_request * Math.PI / 180);
        lon_request = lon + (300/degree_lon_in_km)*y;
        if (lon_request > 180 || lon_request < -180){
            lon_request = -1*lon_request;
            if(Math.sign(lon_request) == 1)
             lon_request = lon_request - (2*(lon_request - 180));
            else
             lon_request = lon_request + (2*(Math.abs(lon_request) - 180));
        }

        const Url = makeApiRequestUrl(lat_request, lon_request);
        data_sets.push(await fetchReturnsData(Url));
        x++;
        y--;
    }
    while (y != 0){
        lat_request = lat + 2.7*x;
        degree_lon_in_km = 111.32*Math.cos(lat_request * Math.PI / 180);
        lon_request = lon + (300/degree_lon_in_km)*y;
        if (lon_request > 180 || lon_request < -180){
            lon_request = -1*lon_request;
            if(Math.sign(lon_request) == 1)
             lon_request = lon_request - (2*(lon_request - 180));
            else
             lon_request = lon_request + (2*(Math.abs(lon_request) - 180));
        }

        const Url = makeApiRequestUrl(lat_request, lon_request);
        data_sets.push(await fetchReturnsData(Url));
        x++;
        y++;

    }

    if (data_sets.every(element => element === false)){
        return findNearestPlace(lat, lon, rep+1);
    }
    else {
        var distances = [];
        var nearest_places = [];
        for (let i = 0; i < data_sets.length; i++){
            element = data_sets[i];
            if (element != false){
                nearest_places.push(element[0])
                distances.push(Number(element[0].distance))
            }
        }
        shortest_distance = Math.min(...distances);
        for (let i = 0; i < nearest_places.length; i++){
            place = nearest_places[i];
            if (place.distance == shortest_distance){
                document.getElementById("city_field").value = place.name;
                document.getElementById("country_field").value = place.countryName;
                console.dir(place)
//                document.getElementById("find_friend_form").submit();
            }
        }
    }


}

function makeApiRequestUrl(lat, lon){
    var Url = "http://api.geonames.org/findNearbyPlaceNameJSON?"
            + "lat="
            + lat
            + "&lng="
            + lon
            + "&username=mayar"
            + "&cities=cities15000"
            + "&radius=300"

    return Url;
}

async function fetchReturnsData(Url){
    var flag = true;
    var url_data;
    await fetch(Url)
    .then(response => response.json())
    .then(data=>{
        if (data.geonames === undefined || data.geonames.length == 0) {
                flag = false;
        }
        else url_data = data.geonames;
    })
    console.dir("Thinking");
    if (!flag) return false;
    else return url_data;
}