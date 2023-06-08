// sample.json파일명 수정해서 사용하면 됩니다!
// 경로안내 페이지에서 활용합니다.



// Get the stored coordinates
var coordsString = localStorage.getItem('currentCoords');
// Split the string into parts
var coordsParts = coordsString.split(",");

// Convert each part to a number and store in an array
var currentCoords = coordsParts.map(function(part) {
  return parseFloat(part);
});


function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d * 1000; // Distance in m
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

// Use fetch API to get JSON data
var features; // Save the features globally so they can be used later

fetch('response.json')
  .then(response => response.json())
  .then(jsonData => {
    features = jsonData.features.map(feature => ({
      ...feature,
      announced: false // Add an "announced" flag to each feature
    })); // Save the features for later use
  });

if ("geolocation" in navigator) {
  // Request permission and start watching position
  var watchID = navigator.geolocation.watchPosition(function(position) {
    if (features) { // If the features have been loaded
      features.forEach(feature => {
        if (feature.geometry.type == "Point") {
          var pointCoords = feature.geometry.coordinates;
          var distance = getDistanceFromLatLonInKm(position.coords.latitude, position.coords.longitude, pointCoords[0], pointCoords[1]);
          
          if (distance <= 10 && !feature.announced) { // Check if the distance is less than or equal to 10 meters and if the feature hasn't been announced yet
            console.log(`${feature.properties.description}  / 불러 오기 성공`);
            speech(`${feature.properties.description}`);
            var outputDiv = document.getElementById('textOutput'); 
            outputDiv.textContent = `${feature.properties.description}`; 
            feature.announced = true; // Set the "announced" flag to true so this feature isn't announced again
          }
        }
      });
    }
  }, function(error) {
    console.log("Error occurred: " + error.message);
  });
} else {
  console.log("Geolocation is not supported by this browser.");
}


  