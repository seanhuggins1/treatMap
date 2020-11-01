import {treatData, nextQuestion} from './main.js'


mapboxgl.accessToken = 'pk.eyJ1Ijoic2h1Z2dpbnMiLCJhIjoiY2tnMWliZDB6MnVreDJ5czM1Yzg4b29jOCJ9.-kx3vPkxCh-EbUKbY9Jc0Q';
var geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      types: 'address',
      limit: 3,
});
geocoder.addTo('#geocoder');


export async function getLocation(coordinates){
      
      let url = new URL(`
      /geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json/
      `, 'https://api.mapbox.com');
      url.searchParams.append('access_token', mapboxgl.accessToken);
      let response = await fetch(url);
      let json = await response.json();
      return json;
}


geocoder.on('result', function(result) {
      treatData.center = result.result.center;
      nextQuestion();
});