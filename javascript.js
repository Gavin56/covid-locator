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
                var arrayLength = response.items.length;
                for (i = 1; i < arrayLength; i++) {
                    var locationNameP = $("<p>");
                    var locationName = response.items[i].address.label;
                    var subStringLocationName = locationName.substr(23);
                    locationNameP.text(subStringLocationName);
                    $("#other-location-info").append(locationNameP);
                }

                function initMap() {
                    const directionsRenderer = new google.maps.DirectionsRenderer();
                    const directionsService = new google.maps.DirectionsService();
                    const map = new google.maps.Map(document.getElementById("map"), {
                        zoom: 13,
                        center: { lat: userLat, lng: userLng },
                    });
                    directionsRenderer.setMap(map);
                    calculateAndDisplayRoute(directionsService, directionsRenderer);
        
                }
        
                function calculateAndDisplayRoute(directionsService, directionsRenderer) {
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
        
                $().ready(function() {
                    initMap();
                })
        
            });
        }

        getUserLocation();
        
    });
});