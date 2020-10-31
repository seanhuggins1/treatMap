mapboxgl.accessToken = 'pk.eyJ1Ijoic2h1Z2dpbnMiLCJhIjoiY2tnMWliZDB6MnVreDJ5czM1Yzg4b29jOCJ9.-kx3vPkxCh-EbUKbY9Jc0Q';
var geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      types: 'address',
      limit: 3,
});
geocoder.addTo('#geocoder');


geocoder.on('result', function(result) {
      console.log(result);
      console.log('hello');
});