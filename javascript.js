$(document).ready(function () {

    //Dropdown created for CDC Guidelines and App instructions.
    $(".dropdown-trigger").dropdown();
    $('.modal').modal();
    
    //if the app was previously visited, it will save to local storage as a boolean value.
    var visitedApp = JSON.parse(localStorage.getItem("visitedApp")) || false;

    //if the boolean is false the model will display upon opening the page.
    if(visitedApp === false) {
        $('.modal').modal();
        $('#modal1').modal('open');
    }
    
    $(document).on("click", ".modal-close", function() {
        visitedApp = true;
        localStorage.setItem("visitedApp", JSON.stringify(visitedApp))
    });
    

    //if data is stored, we globally get our saved date and location name with the key "visited" and stores it in an array, or creates a new one if empty.
    var data = JSON.parse(localStorage.getItem("visited")) || [];

    //if no data is stored, display "You have no previously visited locations."
    if (data.length) {
        renderVisited();
    } else {

        $("#visited-box-info").text("You have no previously visited locations.");
        $("#visited-box-info").attr("style", "text-align: center");
    }

    //the renderVisited function first empties the visited-box-info location on the page. A for for loop is than used and will be have 
    //as many iterations as our local storage array is long. In it, visitedNameP is given refference to a p tag with class=visitedName.
    //styling is given to the p tag dynamically to the name and date of the array. the p tag is prepended to the parent div, and the 
    //clear button is appeded below all dynamically created p tags.
    function renderVisited() {
        $("#visited-box-info").empty();

        for (var i = 0; i < data.length; i++) {
            var visitedNameP = $("<p class='visitedName'>");
            visitedNameP.html("<strong> Name: </strong>" + data[i].name + "<br>" + "<strong> Date: </strong>" + data[i].date);

            $("#visited-box-info").prepend(visitedNameP);
        };
        $("#visited-box-info").append($("<a id='clearVisited' class='waves-effect waves-light btn'>"))
        $("#clearVisited").text("Clear Visited");
    };

    //When the clear visted button is clicked, the location box will empty and local storage will be cleared.
    $(document).on("click", "#clearVisited", function () {
        $("#locations-box").empty();
        data = [];
        localStorage.removeItem("visited");
        $("#visited-box-info").text("You have no previously visited locations.");
    })

    //This button uses the user's location using the windows object, and the HERE and Google API's to render a map between the user and the testing sites.
    //the getCurrentPosition function takes the showUserPosition as a parameter. ShowUserPosition uses position (the users position using geolocation) as a 
    //parameter.
    $("#searchButton").on("click", function () {

        function getUserLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showUserPosition);
            }
            else {
                alert("Geolocation is not supported by this browser.");
            }
        };

        //This renders the nearest testing site to the users location.
        function getNearestSiteLocation(response) {
            // $("#nearest-location-info").empty();

            var nearestLocationHeader = $("<h6>");
            $("#nearest-location-info").prepend(nearestLocationHeader);
            nearestLocationHeader.html("<strong> Nearest Location: </strong>");


            var locationName = response.items[0].address.label;

            //Trim the string to only have the necessary information.
            locationName = locationName.substr(23);
            locationName = locationName.substr(0, locationName.length - 15);


            var locationNameP = $("<p class='selected location-name col s12 m10'>");
            locationNameP.text(locationName);
            $("#nearest-location-info").append(locationNameP);


            //Giving new attributes with values to the rendered P elements.
            locationNameP.attr("latitude", response.items[0].position.lat);
            locationNameP.attr("longitude", response.items[0].position.lng);

            //Generate a Select button for each P tag.
            var selectButton = $("<a id='nearestSelectBtn' class='waves-effect waves-light btn selectBtn col s12 m2'>").text("Select");
            selectButton.attr("href", "#map");
            $("#nearest-location-info").append(selectButton);
        }

        //This function takes the geolocation position and plugs it into the HERE API to retrieve nearby locations, then passes the user's location and 
        //the site locations into a Google Maps renderer.
        function showUserPosition(position) {
            var userLat = position.coords.latitude.toFixed(2);
            var userLng = position.coords.longitude.toFixed(2);

            //To turn strings into accurate numbers, we use parseFloat.
            userLat = parseFloat(userLat);
            userLng = parseFloat(userLng);

            //console.log(userLat);
            //console.log(userLng);

            var stringLatLng = userLat + "," + userLng;
            //console.log(stringLatLng);

            var queryURL = "https://discover.search.hereapi.com/v1/discover?apikey=HwBOddp2-8jNUncGQl7uOxplh5Pw_EeGf0BmppjvlpE&q=Covid&at=" + stringLatLng + "&limit=10";

            //HERE Developer API ajax call.
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                console.log(response);
                getNearestSiteLocation(response);

                //Takes the lat and long of the ajax response for the testing location.
                var siteLat = response.items[0].position.lat;
                var siteLng = response.items[0].position.lng;

                //parseFloat is used on the latitude and longitude to get the full number decimal rather than a string.
                siteLat = parseFloat(siteLat);
                siteLng = parseFloat(siteLng);

                $("#other-location-info").empty();
                var otherLocationHeader = $("<h6>");

                $("#other-location-info").prepend(otherLocationHeader);
                otherLocationHeader.html("<strong> Other Locations: </strong>");

                //Loop for creating other site locations
                var arrayLength = response.items.length;

                for (i = 1; i < arrayLength; i++) {
                    var locationName = response.items[i].address.label;
                    var locationNameDiv = $("<div class='row'>");
                    var locationNameP = $("<p class='location-name col s12 m10'>");

                    //Giving new attributes with values to the P elements, just like we did on lines 75 and 76.
                    locationNameP.attr("latitude", response.items[i].position.lat);
                    locationNameP.attr("longitude", response.items[i].position.lng);

                    //console.log(locationNameP);

                    //Eliminates unnecessary text content from the text returned by the AJAX call.
                    locationName = locationName.substr(23);
                    locationName = locationName.substr(0, locationName.length - 15);
                    locationNameP.text(locationName);

                    $("#other-location-info").append(locationNameP);
                    $("#other-location-info").append(locationNameDiv);
                    $(locationNameDiv).append(locationNameP);

                    //Creates a horizontal divide between P elements.
                    $(locationNameDiv).append($("<hr>"));

                    var selectButton = $("<a class='waves-effect waves-light btn selectBtn col s12 m2'>").text("Select");
                    selectButton.attr("href", "#map");
                    $(locationNameDiv).append(selectButton);
                }

                //This function is used to render the map to the screen. it uses prebuilt google functions which were able to be used after getting 
                //an api key and call to the gogle maps api.  here we can control the zoom of the map at its initial rendering, as well as pass 
                //the user's latitude and longitude to the map. The calculateAndDisplay function is called and all neccessary parameters are passed. 
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

                //Here the constants defined from initMap are passed along with the users lat and lon for location.  This allows the google map on screen 
                //to display a route from the users location to their highlighted desired destination.  Should for some reason the map fails to render, be it
                //a client issue or an issue on google's end, the status will be returned to the user.
                function calculateAndDisplayRoute(directionsService, directionsRenderer, siteLat, siteLng) {
                    directionsService.route(
                        //We can use numbers, basic variables, and object properties to plug coordinates into the map renderer (cannot use functions).             
                        //We need to somehow extract the user coordinates and the testing site coordinates from the previous code and plug them into here:
                        {
                            origin: { lat: userLat, lng: userLng }, //User coordinates
                            destination: { lat: siteLat, lng: siteLng }, //Site coordinates
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

                //Needed to make a new div specifically for the visit button so we could empty it every time the user clicks
                //"Find A Location Near Me" to prevent the visitbutton from rendering on top of itself each time.
                $("#visitButtonDiv").empty();
                $("#visitButtonDiv").append($("<a id='visitButton' class='waves-effect waves-light btn'>"))
                $("#visitButton").text("Visit Selected");

                //This button when clicked has the highlighted selected class.  The map of the location is rendered to the user with the route.
                $(document).on("click", ".selectBtn", function () {

                    //This selects the address which is a sibling of the select button.
                    var siteLat = $(this).siblings("p")[0].attributes[1].nodeValue;
                    var siteLng = $(this).siblings("p")[0].attributes[2].nodeValue;

                    //console.log($(this).parent("p"));

                    siteLat = parseFloat(siteLat);
                    siteLng = parseFloat(siteLng);

                    // console.log(siteLat, siteLng)
                    initMap(siteLat, siteLng)

                    //Dynamically adds a class to whichever location we click and highlights it.
                    $(".selected").removeClass("selected");
                    $(this).siblings("p").addClass("selected");
                });
            });
        }
        getUserLocation();
    });

    //This button puts the selected P element text content and the current date inside of an object and then saves the object 
    //to an array and saves it in local storage.
    $(document).on("click", "#visitButton", function () {
        var visitedName = $(".selected").text();
        visitedName = visitedName.substr(0, visitedName.length - 6);

        var visitedDate = moment().format("l");
        var latLngObj = {
            name: visitedName,
            date: visitedDate,
        };

        data.push(latLngObj);
        localStorage.setItem("visited", JSON.stringify(data));

        renderVisited();
    });

});