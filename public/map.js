mapboxgl.accessToken = 'pk.eyJ1Ijoic2h1Z2dpbnMiLCJhIjoiY2tnd24xbW5jMGJsczJxbG5yMGEzazQ5aiJ9.FxooIHh6YNpvjBtY7Im8PQ';


var candy = [
      {
            'type': 'Feature',
            'geometry': {
                  'type': 'Point',
                  'coordinates': [0, 0]
            }
      },
      {
            'type': 'Feature',
            'geometry': {
                  'type': 'Point',
                  'coordinates': [0, 0]
            }
      },
      {
            'type': 'Feature',
            'geometry': {
                  'type': 'Point',
                  'coordinates': [0, 0]
            }
      }
]


function addCandyToMap(center) {
      let newCandy = {
            'type': 'Feature',
            'geometry': {
                  'type': 'Point',
                  'coordinates': center
            }
      }
      candy.push(newCandy);
}


async function getAddressLngLat(address) {
      //setup a URL object to the mapbox geocoding api with our address
      let url = new URL(`/geocoding/v5/mapbox.places/${address}.json`, 'https://api.mapbox.com');
      url.searchParams.append("access_token", mapboxgl.accessToken);

      //use fetch to call the mapbox API
      let response = await fetch(url);
      let json = await response.json();


      console.log(JSON.stringify(json, null, 2));
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
function initMap(center = [0, 0]) {


      //initialize the map
      map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/shuggins/ckgwnjfgn0yl119s4bob2uyx9', // style URL
            center: [0, 0], // starting position [lng, lat]
            zoom: 2 // starting zoom
      });


      map.on("load", function () {


            //fly to the address that the user searched

            async function flyToAddress(address) {
                  map.flyTo({
                        center: center,
                        zoom: 17,
                  })
            }
            flyToAddress();


            map.loadImage(
                  'https://uxwing.com/wp-content/themes/uxwing/download/23-animals-and-nature/halloween.png',
                  function (error, image) {
                        if (error) throw error;
                        map.addImage('cat', image);
                        map.addSource('point', {
                              'type': 'geojson',
                              'data': {
                                    'type': 'FeatureCollection',
                                    'features': candy
                              }
                        });
                        map.addLayer({
                              'id': 'points',
                              'type': 'symbol',
                              'source': 'point',
                              'layout': {
                                    'icon-image': 'cat',
                                    'icon-size': 0.1
                              }
                        });
                  }
            );

      });
}







//getLocation();










