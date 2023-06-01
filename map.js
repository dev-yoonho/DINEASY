var map;

	// 페이지가 로딩이 된 후 호출하는 함수입니다.
function initTmap(){
	// map 생성
	// Tmapv2.Map을 이용하여, 지도가 들어갈 div, 넓이, 높이를 설정합니다.
	map = new Tmapv2.Map("map_div",  // "map_div" : 지도가 표시될 div의 id
	{
		center: new Tmapv2.LatLng(37.56004728498993, 126.93688499998413), // 지도 초기 좌표
		width: "100%", // map의 width 설정
		height: "400px", // map의 height 설정
		zoom : 17
	});
	//Marker 객체 생성.
	var marker = new Tmapv2.Marker({
		position: new Tmapv2.LatLng(37.56520450, 126.98602028), //Marker의 중심좌표 설정.
		map: map //Marker가 표시될 Map 설정..
	});
}

///////////////

var lat;
var lon;
var options = {
	enableHighAccuracy: true,
	timeout: 5000,
	maximumAge: 0
};
function success(position) {
	console.log(position);
	lat=position.coords.latitude, // 위도
	lon=position.coords.longitude; // 경도

	var locPosition = new Tmapv2.LatLng(lat, lon);

	// 마커와 인포윈도우를 표시	
	displayMaker(locPosition);
};
function error(err) {
	console.log(err);
};
if(navigator.geolocation){
	var na= navigator.geolocation.watchPosition(success,error, options);
	console.log(na);
}
// 마커 생성기
var marker;
var flag=false;

function displayMaker(locPosition) {
	console.log(1);
	if(flag){
		marker.setMap(null);
	}
    // 마커를 생성합니다.
	marker = new Tmapv2.Marker({
		position: locPosition,
        map: map
	});
	marker.setMap(map);
	flag=true;
    map.setCenter(locPosition);
}