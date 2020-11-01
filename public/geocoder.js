import {treatData, goToQuestion} from './main.js'


mapboxgl.accessToken = 'pk.eyJ1Ijoic2h1Z2dpbnMiLCJhIjoiY2tnMWliZDB6MnVreDJ5czM1Yzg4b29jOCJ9.-kx3vPkxCh-EbUKbY9Jc0Q';

//geocoder for choosing treat
var geocoder1 = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      limit: 3,
});
geocoder1.addTo('#geocoder-1');
geocoder1.on('result', function(result) {
      treatData.center = result.result.center;
      goToQuestion(2);
});


//geocoder for choosing treat giving location
var geocoder2 = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      types: 'address',
      limit: 3,
});
geocoder2.addTo('#geocoder-2');
geocoder2.on('result', function(result) {
      treatData.center = result.result.center;
      goToQuestion(4);
});


export async function getLocation(coordinates){
      
      let url = new URL(`
      /geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json/
      `, 'https://api.mapbox.com');
      url.searchParams.append('access_token', mapboxgl.accessToken);
      let response = await fetch(url);
      let json = await response.json();
      return json;
}


