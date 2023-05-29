var mapContainer = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
var mapOption = { //지도를 생성할 때 필요한 기본 옵션
	center: new kakao.maps.LatLng(37.56004728498993, 126.93688499998413), //지도의 중심좌표(연세대학교 교차로)
	level: 3 //지도의 레벨(확대, 축소 정도)
};

var map = new kakao.maps.Map(mapContainer, mapOption); //지도 생성 및 객체 리턴

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

	var locPosition = new kakao.maps.LatLng(lat, lon),
	message = '<div style="padding:5px">현재 위치</div>';

	// 마커와 인포윈도우를 표시	
	displayMaker(locPosition, message);
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

function displayMaker(locPosition, message) {
	console.log(1);
	if(flag){
		marker.setMap(null);
	}
	// 마커를 생성합니다.
	marker = new kakao.maps.Marker({
		position: locPosition
	});
	marker.setMap(map);
	flag=true;

	map.setCenter(locPosition);
}