$(document).ready(function () {

    var hereAPPID = "HwBOddp2-8jNUncGQl7uOxplh5Pw_EeGf0BmppjvlpE";

    $("#searchButton").on("click", function () {
        function getUserLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showUserPosition);
            }
            else {
                alert("Geolocation is not supported by this browser.");
            }
        };

        function getNearestSiteLocation(response) {
            $("#location-box-info").empty();
            var locationNameP = $("<p>");
            var locationName = response.items[0].address.label;
            var subStringLocationName = locationName.substr(23);
            locationNameP.text(subStringLocationName);
            $("#location-box-info").append(locationNameP);
        }

        function showUserPosition(position) {
            var lat = position.coords.latitude.toFixed(2);
            var lon = position.coords.longitude.toFixed(2);
            console.log(lat);
            console.log(lon);

            var stringLatLon = lat + "," + lon;
            console.log(stringLatLon);

            var queryURL = "https://discover.search.hereapi.com/v1/discover?apikey=" + hereAPPID + "&q=Covid&at=" + stringLatLon + "&limit=10";

            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                console.log(response);
                getNearestSiteLocation(response);

    
                var siteLat = response.items[0].position.lat;
                var siteLon = response.items[0].position.lng;

                initMap(siteLat, siteLon);

                $("#other-location-info").empty();
                var arrayLength = response.items.length;
                for (i = 1; i < arrayLength; i++) {
                    var locationNameP = $("<p>");
                    var locationName = response.items[i].address.label;
                    var subStringLocationName = locationName.substr(23);
                    locationNameP.text(subStringLocationName);
                    $("#other-location-info").append(locationNameP);
                }
            });
        }

        getUserLocation();
        
        var placeURL= "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyB5Jt_zYBv_3Wcr0xp_SR2RHWvy65WPUBc"
        $.ajax({
            url: placeURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
        });

        // Initialize and add the map
        function initMap(latitude, longitude) {
            // The location of Uluru
            const covidTestingSite = { lat: latitude, lng: longitude };
            // The map, centered at covidTestingSite
            const map = new google.maps.Map(document.getElementById("map"), {
                zoom: 15,
                center: covidTestingSite,
            });
            // The marker, positioned at covidTestingSite
            const marker = new google.maps.Marker({
                position: covidTestingSite,
                map: map,
            });
        }
    });
});


/*
        function handleLocation() {
            //Get user location and return lat/lon to ajax call:

            var positionCoord = showPosition();
            var hereAPPID = "cahABOyt5yZgdm70nIfb";
            var queryURL = "https://discover.search.hereapi.com/v1/discover?apikey=" + hereAPPID + "&q=Covid&at=" + positionCoord + "&limit=10";

            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                console.log(response);
            });
        }

        $("button").on("click", handleLocation());
*/
//Input field and button sibling to use the input value to insert into ajax call
// Set variables for API Keys
// Setup API urls
//googlmaps API find proper covidAPI

