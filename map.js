mapboxgl.accessToken = 'pk.eyJ1Ijoic2h1Z2dpbnMiLCJhIjoiY2tnd24xbW5jMGJsczJxbG5yMGEzazQ5aiJ9.FxooIHh6YNpvjBtY7Im8PQ';

async function getAddressLngLat(address){
      //setup a URL object to the mapbox geocoding api with our address
      let url = new URL(`/geocoding/v5/mapbox.places/${address}.json`, 'https://api.mapbox.com');
      url.searchParams.append("access_token", mapboxgl.accessToken);
      
      //use fetch to call the mapbox API
      let response = await fetch(url);
      let json = await response.json();

      

      return json.features[0].center;
}


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

      //initialize the map
      map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/shuggins/ckgwnjfgn0yl119s4bob2uyx9', // style URL
            center: [position.coords.longitude, position.coords.latitude], // starting position [lng, lat]
            zoom: 17 // starting zoom
      });

      
      map.on("load", function () {


            //fly to the address that the user searched

            async function flyToAddress(address) {
                  map.flyTo({
                        center: await getAddressLngLat(address),
                  })
            }
            flyToAddress('893 richmond street');
      });
}

getLocation();










