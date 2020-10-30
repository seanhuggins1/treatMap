mapboxgl.accessToken = 'pk.eyJ1Ijoic2h1Z2dpbnMiLCJhIjoiY2tnd24xbW5jMGJsczJxbG5yMGEzazQ5aiJ9.FxooIHh6YNpvjBtY7Im8PQ';



function getLocation() {
      let options = {
            enableHighAccuracy: true,
            maximumAge: 0
      };
      if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(initMap, error, options);
      } else {
            alert("Geolocation is not supported by this browser.");
      }
}

function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
}

var map;
function initMap(position) {
      map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/shuggins/ckgwnjfgn0yl119s4bob2uyx9', // style URL
            center: [position.coords.longitude, position.coords.latitude], // starting position [lng, lat]
            zoom: 17 // starting zoom
      });
}

getLocation();







