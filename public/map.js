import { treatData } from "./main.js";
import { treatTypeTags, treatDietTags } from './tags.js';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2h1Z2dpbnMiLCJhIjoiY2tnd24xbW5jMGJsczJxbG5yMGEzazQ5aiJ9.FxooIHh6YNpvjBtY7Im8PQ';

function generateRandomCoordinates() {
      let lng = -180 + Math.floor(Math.random() * 360);
      let lat = -90 + Math.floor(Math.random() * 180);
      return [lng, lat];
}

var treatFeatures = [];
function generateDummyTreatFeatures(numFeatures) {
      for (let i = 0; i < numFeatures; i++) {



            //choose a random number of tags from the typeTags
            let numTypeChoices = Math.floor(Math.random() * (treatTypeTags.length + 1));
            let typeChoices = [];
            while (typeChoices.length < numTypeChoices) {
                  var typeChoice = treatTypeTags[Math.floor(Math.random() * treatTypeTags.length)];
                  if (typeChoices.indexOf(typeChoice) === -1) typeChoices.push(typeChoice);
            }

            //choose a random number of tags from the typeTags
            let numDietChoices = Math.floor(Math.random() * (treatDietTags.length + 1));
            let dietChoices = [];
            while (dietChoices.length < numDietChoices) {
                  let dietChoice = treatDietTags[Math.floor(Math.random() * treatDietTags.length)];
                  if (dietChoices.indexOf(dietChoice) === -1) dietChoices.push(dietChoice);
            }



            let feature = {
                  'type': 'Feature',
                  'geometry': {
                        'type': 'Point',
                        'coordinates': generateRandomCoordinates()
                  },
                  'properties': {
                        'treatTypeTags': typeChoices,
                        'treatDietTags': dietChoices,
                  }
            }
            treatFeatures.push(feature);
      }
}
generateDummyTreatFeatures(100);

function updateTreatFeatures(features) {
      let dataGeoJson = {
            'type': 'FeatureCollection',
            'features': features
      }
      map.getSource('treats-source').setData(dataGeoJson);
}





export function addTreatToMap(treatData) {
      let newCandy = {
            'type': 'Feature',
            'geometry': {
                  'type': 'Point',
                  'coordinates': treatData.center,

            },
            'properties': {
                  'treatTypeTags': treatData.treatTypeTags,
                  'treatDietTags': treatData.treatDietTags,
            }
      }
      treatFeatures.push(newCandy);
      updateTreatFeatures(treatFeatures);
}




async function getAddressLngLat(address) {
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
            navigator.geolocation.getCurrentPosition(initMap, () => { }, options);
      } else {
            alert("Geolocation is not supported by this browser.");
      }
}

function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
}

var map;


export function filterTreatFeatures(typeTags, dietTags) {

      let filteredTreatFeatures = [];

      for (let treatFeature of treatFeatures) {

            let visible = true;
            for (let typeTag of typeTags) {
                  //we only show treat features with treats that we want to see in the type filters 
                  if (!treatFeature.properties.treatTypeTags.includes(typeTag)) {
                        visible = false;
                  }
            }
            for (let dietTag of dietTags) {
                  //if the treat feature has any of the diet filter tags, we shouldn't show the treat
                  if (treatFeature.properties.treatDietTags.includes(dietTag)) {
                        visible = false;
                  }
            }
            if (visible) {
                  filteredTreatFeatures.push(treatFeature);
            }
      }

      //update the map with the filtered list of features
      updateTreatFeatures(filteredTreatFeatures);
}

document.addEventListener('keypress', function (event) {
      if (event.key == '0') {
            filterTreatFeatures(['Caramilk'], ['Wheat']);
      }
});

//initialize the map
map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/shuggins/ckgwnjfgn0yl119s4bob2uyx9', // style URL
      center: [0, 0], // starting position [lng, lat]
      zoom: 2 // starting zoom
});

//fly to a centerpoint on the map
export async function flyToCenter(center) {
      map.flyTo({
            center: center,
            zoom: 17,
      })
}



map.on("load", function () {
      map.loadImage(
            'pumpkin.png',
            function (error, image) {
                  if (error) throw error;
                  map.addImage('cat', image);
                  map.addSource('treats-source', {
                        'type': 'geojson',
                        'data': {
                              'type': 'FeatureCollection',
                              'features': treatFeatures
                        }
                  });
                  map.addLayer({
                        'id': 'treats-layer',
                        'type': 'symbol',
                        'source': 'treats-source',
                        'layout': {
                              'icon-image': 'cat',
                              'icon-size': ['interpolate', ['linear'], ['zoom'], 2, 0.1, 15, 0.25]
                        }
                  });
            }
      );
});
//
// function handleTreatClick(e) {
//       let features = map.queryRenderedFeatures(
//             e.point,
//             { layers: ['treats-layer'] }
//       );
//       console.log(JSON.stringify(features[0]));
// }

// map.on('click', handleTreatClick(e));



//getLocation();










