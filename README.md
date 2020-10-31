# COVID Testing Site Locator

## Introduction

This application allows the user to find available COVID Testing Sites near their location.  The "Find A Location Near Me" button finds the users geolocation to to render a list of locations under the box labeled "Locations Near You".  This generates a map of each location from nearest to furthest.  The user can choose any location by clicking the "Select" button next to the prefered testing site and display a new map for the selected location.  Under the map, a "Visit Selected" button is available that stores to location and date to local storage. This will be displayed in the "Visited Locations" section.  This feature allows the user to keep track of their testing sites and when they were last tested.  There is an option for the user to clear local storage at any time.

## Major Progress task 1

* generated api key from Here Developments covid testing site api.

* An ajax call was made using this URL to retreive the users nearest locations with the limit set to 10.

* This was accomplished by getting the users geolocation using the windows object and putting their latitude and longitude into the URL.

* Within the HTML the location for the users location was determined and its row and collumns were given the information dynamically.

* The select button near the addresses are also dynamically generated.

## Major Progress task 2

* The google initMap function was used and given to index.html to display the map. To get this to work the   
  users latitude and longitude 
  were passed to the initMap.

* A route is displayed in the map from point A to point B. from the users location to their selected testing site location.

## Major Task 3

* Two keys are saved into local storage. Visited and VisitedApp.

  * Visited is a key that contains the selected location the user chose to visit.
    This saves their location and date visited to local storaage.

  * VisitedApp is a key that stores a boolean value dependant on whether or not 
    the user has visited the site.  This way the modal only ever appears once to a new user.

  * This modal can be viewed again by clicking the drop down dehaze icon and ckicking the 
    guide me button.

## Major Task 4

* HTML, CSS, and javascript filesare commented and cleaned up.  Redundant code removed.

* css is cleaned up and entire site made ewth full mobile first design.

## Link to Deployed Application
https://gavin56.github.io/covid-locator/

<br>

## Website Images

<img src="./assets/Screen Shot 2020-10-30 at 7.40.36 PM.png">
<hr>
<img src="./assets/Screen Shot 2020-10-30 at 7.41.00 PM.png">
<img src="./assets/Screen Shot 2020-10-30 at 7.42.01 PM.png">
