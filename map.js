function initTmap(){
	// HTML5의 geolocation으로 사용할 수 있는지 확인합니다 
if (navigator.geolocation) {

    // GeoLocation을 이용해서 접속 위치를 얻어옵니다
    navigator.geolocation.getCurrentPosition(function(position) {

        var lat = position.coords.latitude, // 위도
            lon = position.coords.longitude; // 경도

        var locPosition = new Tmapv2.LatLng(lat, lon); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다

        // 마커를 표시합니다
        displayMarker(locPosition);

      });

} else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치를 설정합니다

    var locPosition = new Tmapv2.LatLng(37.56004728498993, 126.93688499998413);

    displayMarker(locPosition);
}

function displayMarker(locPosition) {

    // 마커를 생성합니다
    var marker = new Tmapv2.Marker({  
        position: locPosition,
		map: map
    }); 

    // 지도 중심좌표를 접속위치로 변경합니다
    map.setCenter(locPosition);      
}    
	var map = new Tmapv2.Map("map",  
	{
		center: new Tmapv2.LatLng(37.56004728498993, 126.93688499998413), // 지도 초기 좌표
		width: "375px", 
		height: "550px", // 지도의 사이즈
		zoom: 16 // 지도의 레벨(확대, 축소 정도)
	});

	var marker = new Tmapv2.Marker({
		position: new Tmapv2.LatLng(37.56004728498993, 126.93688499998413),
		map: map
	});	
} 



/*var lat;
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
}*/
