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
            $("#nearest-location-info").empty();

            var nearestLocationHeader = $("<h6>");
            $("#nearest-location-info").prepend(nearestLocationHeader);
            nearestLocationHeader.text("Nearest Location:");

            var locationNameP = $("<p class='selected location-name'>");
            var locationName = response.items[0].address.label;
            locationName = locationName.substr(23);
            locationName = locationName.substr(0, locationName.length-15);
            locationNameP.text(locationName);
            $("#nearest-location-info").append(locationNameP);

            locationNameP.attr("latitude", response.items[0].position.lat);
            locationNameP.attr("longitude", response.items[0].position.lng);

            var selectButton = $("<a class='waves-effect waves-light btn'>").text("Select");
            $(locationNameP).append(selectButton);
        }

        function showUserPosition(position) {
            var userLat = position.coords.latitude.toFixed(2);
            var userLng = position.coords.longitude.toFixed(2);

            userLat = parseFloat(userLat);
            userLng = parseFloat(userLng);

            console.log(userLat);
            console.log(userLng);

            var stringLatLng = userLat + "," + userLng;
            console.log(stringLatLng);

            var queryURL = "https://discover.search.hereapi.com/v1/discover?apikey=" + hereAPPID + "&q=Covid&at=" + stringLatLng + "&limit=10";

            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                console.log(response);
                getNearestSiteLocation(response);
    
                var siteLat = response.items[0].position.lat;
                var siteLng = response.items[0].position.lng;

                siteLat = parseFloat(siteLat);
                siteLng = parseFloat(siteLng);

                $("#other-location-info").empty();
                var otherLocationHeader = $("<h6>");
                $("#other-location-info").prepend(otherLocationHeader);
                otherLocationHeader.text("Other Locations:");

                //Loop for creating other site locations//
                var arrayLength = response.items.length;
                for (i = 1; i < arrayLength; i++) {         

                    var locationName = response.items[i].address.label;
                    var locationNameDiv = $("<div>");
                    var locationNameP = $("<p class='location-name'>");

                    locationNameP.attr("latitude", response.items[i].position.lat);
                    locationNameP.attr("longitude", response.items[i].position.lng);

                    console.log(locationNameP);

                    locationName = locationName.substr(23);
                    locationName = locationName.substr(0, locationName.length-15);
                    locationNameP.text(locationName);

                    $("#other-location-info").append(locationNameP);
                    $("#other-location-info").append(locationNameDiv);
                    $(locationNameDiv).append(locationNameP);

                    var newHr = $("<hr>");
                    $(locationNameDiv).append(newHr);

                    var selectButton = $("<a class='waves-effect waves-light btn'>").text("Select");
                    $(locationNameP).append(selectButton);
                }

                function initMap(siteLat, siteLng) {
                    const directionsRenderer = new google.maps.DirectionsRenderer();
                    const directionsService = new google.maps.DirectionsService();
                    const map = new google.maps.Map(document.getElementById("map"), {
                        zoom: 13,
                        center: { lat: userLat, lng: userLng },
                    });
                    directionsRenderer.setMap(map);
                    calculateAndDisplayRoute(directionsService, directionsRenderer, siteLat, siteLng);
        
                }
        
                function calculateAndDisplayRoute(directionsService, directionsRenderer, siteLat, siteLng) {
                    directionsService.route(
                        //We can use numbers, basic variables, and object properties to plug coordinates into the map renderer (cannot use functions).             
                        //We need to somehow extract the user coordinates and the testing site coordinates from the previous code and plug them into here:
                        {
                            origin: { lat: userLat, lng: userLng}, //User coordinates//
                            destination: { lat: siteLat, lng: siteLng}, //..........................Site coordinates//
                            travelMode: google.maps.TravelMode.DRIVING,
                        },
                        (response, status) => {
                            if (status === "OK") {
                                directionsRenderer.setDirections(response);
                            } else {
                                window.alert("Directions request failed due to " + status);
                            }
                        }
                    );
                }       
                    initMap(siteLat, siteLng);

                    $(document).on("click", ".btn", function(){
                        //Discovered this through messing around with the window object in the console.//
                        var siteLat = $(this).parent("p")[0].attributes[1].nodeValue;
                        var siteLng = $(this).parent("p")[0].attributes[2].nodeValue;
                        siteLat = parseFloat(siteLat);
                        siteLng = parseFloat(siteLng);

                        console.log(siteLat, siteLng)

                        initMap(siteLat, siteLng)
            
                        $(".selected").removeClass("selected");
                        $(this).parent("p").addClass("selected");
                    });
            });
        }

        getUserLocation();
        
    });
});