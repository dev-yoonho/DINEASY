let data = [
  [37.5605672, 126.9433486, "현재 위치"]
];
console.log("실행됨 0")
let printedDescriptions = new Set();

function success(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  console.log("실행됨 1")

  data.forEach(([dataLat, dataLon, description]) => {
    console.log("실행됨 3")
      if (getDistanceFromLatLonInKm(dataLat, dataLon, lat, lon) <= 10 && !printedDescriptions.has(description)) {
        console.log("실행됨 4")  
        console.log(description);
          speech(description);
          printedDescriptions.add(description);
      }
  });
}

navigator.geolocation.watchPosition(success, error, options);

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  console.log("실행됨 2")
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