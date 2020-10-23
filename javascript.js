$(document).ready(function () {

    var hereAPPID = "HwBOddp2-8jNUncGQl7uOxplh5Pw_EeGf0BmppjvlpE";
    //var hereAPPID = "QvufAHQVEYSzm5IrwjP6";

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        }
        else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    function showPosition(position) {
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
        });
    }

    getLocation();
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

