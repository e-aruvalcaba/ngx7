
//TODO: Need to clean this up ASAP

var google = google || {};

// google map exemple 1 - simple map
(function(window, google){

  // The action happens in self invoking function
  // Configure map options
  // ---------------------


  var options = {
    center: {
      lat: 25.686614,
      lng: -100.316113
      //to get the latitude and longitude use: http://www.latlong.net/
    },

    zoom: 12,
    styles: [
        {
            "featureType": "administrative.country",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "administrative.province",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "administrative.province",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        }
    ], // snazzymaps.com

    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    scrollwheel: false,
    draggable: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.TOP_RIGHT
    },

    mapTypeControlOptions: {
       position: google.maps.ControlPosition.TOP_CENTER
    }
  },
  

  // A div with the id #map was created before in the HTML document
  // ---------------------------------------------------------------------
  element = document.getElementById('map'),
  

  // Placing the map in the selected div above
  // -----------------------------------------
  map = new google.maps.Map(element, options);
}(window, google));


// google map example 2 - bottom ribbon
(function(window, google){



  // The action happens in self invoking function

  // Configure map options

  // ---------------------



  var options = {

    center: {

      lat: 25.686614,

      lng: -100.316113

      //to get the latitude and longitude use: http://www.latlong.net/

    },

    zoom: 12,

    styles: [
        {
            "featureType": "administrative.country",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "administrative.province",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "administrative.province",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        }
    ], // snazzymaps.com

    zoomControl: true,

    mapTypeControl: false,

    scaleControl: false,

    streetViewControl: false,

    rotateControl: false,

    fullscreenControl: false,

    scrollwheel: false,

    draggable: true,

    zoomControlOptions: {

      position: google.maps.ControlPosition.TOP_RIGHT

    },

    mapTypeControlOptions: {

       position: google.maps.ControlPosition.TOP_CENTER

    }

  },
  

  // A div with the id #map was created before in the HTML document

  // ---------------------------------------------------------------------

  element = document.getElementById('map2'),
  

  // Placing the map in the selected div above

  // -----------------------------------------

  map = new google.maps.Map(element, options);



}(window, google));


// google map example 3 - side panel
(function(window, google){



  // The action happens in self invoking function

  // Configure map options

  // ---------------------



  var options = {

    center: {

      lat: 25.686614,

      lng: -100.316113

      //to get the latitude and longitude use: http://www.latlong.net/

    },

    zoom: 12,

    styles: [
        {
            "featureType": "administrative.country",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "administrative.province",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "administrative.province",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        }
    ], // snazzymaps.com

    zoomControl: true,

    mapTypeControl: false,

    scaleControl: false,

    streetViewControl: false,

    rotateControl: false,

    fullscreenControl: false,

    scrollwheel: false,

    draggable: true,

    zoomControlOptions: {

      position: google.maps.ControlPosition.TOP_RIGHT

    },

    mapTypeControlOptions: {

       position: google.maps.ControlPosition.TOP_CENTER

    }

  },
  

  // A div with the id #map was created before in the HTML document

  // ---------------------------------------------------------------------

  element = document.getElementById('map3'),
  

  // Placing the map in the selected div above

  // -----------------------------------------

  map = new google.maps.Map(element, options);



}(window, google));


// google map dashboard module example
(function(window, google){



  // The action happens in self invoking function

  // Configure map options

  // ---------------------



  var options = {

    center: {

      lat: 25.686614,

      lng: -100.316113

      //to get the latitude and longitude use: http://www.latlong.net/

    },

    zoom: 12,

    styles: [
        {
            "featureType": "administrative.country",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "administrative.province",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "administrative.province",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        }
    ], // snazzymaps.com

    zoomControl: true,

    mapTypeControl: false,

    scaleControl: false,

    streetViewControl: false,

    rotateControl: false,

    fullscreenControl: false,

    scrollwheel: false,

    draggable: true,

    zoomControlOptions: {

      position: google.maps.ControlPosition.TOP_RIGHT

    },

    mapTypeControlOptions: {

       position: google.maps.ControlPosition.TOP_CENTER

    }

  },
  

  // A div with the id #map was created before in the HTML document

  // ---------------------------------------------------------------------

  element = document.getElementById('map4'),
  

  // Placing the map in the selected div above

  // -----------------------------------------

  map = new google.maps.Map(element, options);



}(window, google));









