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

            let colors = ["green", "yellow","orange","red"];
            let colorChoice = colors[Math.floor(Math.random()*(colors.length))];

            let feature = createFeature(generateRandomCoordinates(), typeChoices, dietChoices, colorChoice);
            treatFeatures.push(feature);
      }
}
generateDummyTreatFeatures(100);

function createFeature(coordinates, typeTags, dietTags, safetyRating) {

      let description = `
      <div class="tag tag-large" style="background-color: ${safetyRating}">
      
            covid rating
      
      </div>
      
      
      <div class="buttonBox">
      `;

      for (let tag of typeTags) {
            let elemString = `<div class="tag typeTag">${tag}</div>`;
            description += elemString;
      }
      for (let tag of dietTags) {
            let elemString = `<div class="tag dietTag">${tag}</div>`;
            description += elemString;
      }

      description += '</div>';


      let feature = {
            'type': 'Feature',
            'geometry': {
                  'type': 'Point',
                  'coordinates': coordinates,
            },
            'properties': {
                  'treatTypeTags': typeTags,
                  'treatDietTags': dietTags,
                  'description': description,
            }
      }
      return feature;
}
async function generateTreatFeaturesFromDB() {
      let response = await fetch('/Candies', {
            method: 'GET',
      });
      let json = await response.json();

      //parse the treat features
      let treats = json["Treats "];
      for (let treatData of treats) {
            let feature = createFeature(treatData.center, treatData.treatTypeTags, treatData.treatDietTags);
            treatFeatures.push(feature);
      }



}
//generateTreatFeaturesFromDB();

function updateTreatFeatures(features) {
      let dataGeoJson = {
            'type': 'FeatureCollection',
            'features': features
      }
      map.getSource('treats-source').setData(dataGeoJson);
}





export function addTreatToMap(treatData) {
      let feature = createFeature(treatData.center, treatData.treatTypeTags, treatData.treatDietTags);
      treatFeatures.push(feature);
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


map.on('click', 'treats-layer', function (e) {
      var coordinates = e.features[0].geometry.coordinates.slice();
      var description = e.features[0].properties.description;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
});

// Change the cursor to a pointer when the mouse is over the places layer.
map.on('mouseenter', 'treats-layer', function (e) {
      map.getCanvas().style.cursor = 'pointer';
});

// Change it back to a pointer when it leaves.
map.on('mouseleave', 'treats-layer', function () {
      map.getCanvas().style.cursor = '';
});

//getLocation();










