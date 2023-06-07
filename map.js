//호수 수정사항 = currentCoords 가 로컬에 저장되도록 추가
// currentCoords 사용하려면 불러온 이후 숫자 배열로 변경해야함
// 좌표 주소로 만들기...-> 로컬로 옮기기


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

	//현재 위치 로컬 스토리지 저장//
	if (lat!=null){
	var currentCoords = [lat,lon];
	localStorage.setItem('currentCoords', currentCoords);
	console.log(`현재위치:`+currentCoords);
	//여기까지 - 콘솔출력//


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

function AddressToCoordinates(address) {
		var fullAddr = $("#fullAddr").val();
		var headers = {}; 
		headers["appKey"]="KThdzstXSE8XxtqffJ4IC5eV2M9jBSvH59JYlmWW";
		$.ajax({
			method : "GET",
			headers : headers,
			url : "https://apis.openapi.sk.com/tmap/geo/fullAddrGeo?version=1&format=json&callback=result",
			async : false,
			data : {
				"coordType" : "WGS84GEO",
				"fullAddr" : address
			},
			success : function(response) {

				var resultInfo = response.coordinateInfo; // .coordinate[0];
				if (response.coordinateInfo.coordinate[0].lat!=""){
					console.log(`목적지 구주소 기반 x 좌표:`+response.coordinateInfo.coordinate[0].lat);
					console.log(`목적지 구주소 기반 y 좌표:`+response.coordinateInfo.coordinate[0].lon);
				}
				else {
					console.log(`목적지 신주소 x좌표:`+response.coordinateInfo.coordinate[0].newLat);
					console.log(`목적지 신주소 y좌표:`+response.coordinateInfo.coordinate[0].newLon);
				}

				// 3.마커 찍기
				// 검색 결과 정보가 없을 때 처리
				if (resultInfo.coordinate.length == 0) {
					$("#result").text(
					"요청 데이터가 올바르지 않습니다.");
				} else {
					var lon, lat;
					var resultCoordinate = resultInfo.coordinate[0];
					if (resultCoordinate.lon.length > 0) {
						// 구주소
						lon = resultCoordinate.lon;
						lat = resultCoordinate.lat;
					} else { 
						// 신주소
						lon = resultCoordinate.newLon;
						lat = resultCoordinate.newLat
					}
				
					var lonEntr, latEntr;
					
					if (resultCoordinate.lonEntr == undefined && resultCoordinate.newLonEntr == undefined) {
						lonEntr = 0;
						latEntr = 0;
					} else {
						if (resultCoordinate.lonEntr.length > 0) {
							lonEntr = resultCoordinate.lonEntr;
							latEntr = resultCoordinate.latEntr;
						} else {
							lonEntr = resultCoordinate.newLonEntr;
							latEntr = resultCoordinate.newLatEntr;
						}
					}

					// 검색 결과 표출
					var matchFlag, newMatchFlag;
					// 검색 결과 주소를 담을 변수
					var address = '', newAddress = '';
					var city, gu_gun, eup_myun, legalDong, adminDong, ri, bunji;
					var buildingName, buildingDong, newRoadName, newBuildingIndex, newBuildingName, newBuildingDong;
					
					// 새주소일 때 검색 결과 표출
					// 새주소인 경우 matchFlag가 아닌
					// newMatchFlag가 응답값으로
					// 온다
					if (resultCoordinate.newMatchFlag.length > 0) {
						// 새(도로명) 주소 좌표 매칭
						// 구분 코드
						newMatchFlag = resultCoordinate.newMatchFlag;
						
						// 시/도 명칭
						if (resultCoordinate.city_do.length > 0) {
							city = resultCoordinate.city_do;
							newAddress += city + "\n";
						}
						
						// 군/구 명칭
						if (resultCoordinate.gu_gun.length > 0) {
							gu_gun = resultCoordinate.gu_gun;
							newAddress += gu_gun + "\n";
						}
						
						// 읍면동 명칭
						if (resultCoordinate.eup_myun.length > 0) {
							eup_myun = resultCoordinate.eup_myun;
							newAddress += eup_myun + "\n";
						} else {
							// 출력 좌표에 해당하는
							// 법정동 명칭
							if (resultCoordinate.legalDong.length > 0) {
								legalDong = resultCoordinate.legalDong;
								newAddress += legalDong + "\n";
							}
							// 출력 좌표에 해당하는
							// 행정동 명칭
							if (resultCoordinate.adminDong.length > 0) {
								adminDong = resultCoordinate.adminDong;
								newAddress += adminDong + "\n";
							}
						}
						// 출력 좌표에 해당하는 리 명칭
						if (resultCoordinate.ri.length > 0) {
							ri = resultCoordinate.ri;
							newAddress += ri + "\n";
						}
						// 출력 좌표에 해당하는 지번 명칭
						if (resultCoordinate.bunji.length > 0) {
							bunji = resultCoordinate.bunji;
							newAddress += bunji + "\n";
						}
						// 새(도로명)주소 매칭을 한
						// 경우, 길 이름을 반환
						if (resultCoordinate.newRoadName.length > 0) {
							newRoadName = resultCoordinate.newRoadName;
							newAddress += newRoadName + "\n";
						}
						// 새(도로명)주소 매칭을 한
						// 경우, 건물 번호를 반환
						if (resultCoordinate.newBuildingIndex.length > 0) {
							newBuildingIndex = resultCoordinate.newBuildingIndex;
							newAddress += newBuildingIndex + "\n";
						}
						// 새(도로명)주소 매칭을 한
						// 경우, 건물 이름를 반환
						if (resultCoordinate.newBuildingName.length > 0) {
							newBuildingName = resultCoordinate.newBuildingName;
							newAddress += newBuildingName + "\n";
						}
						// 새주소 건물을 매칭한 경우
						// 새주소 건물 동을 반환
						if (resultCoordinate.newBuildingDong.length > 0) {
							newBuildingDong = resultCoordinate.newBuildingDong;
							newAddress += newBuildingDong + "\n";
						}
						// 검색 결과 표출
						if (lonEntr > 0) {
							var docs = "<a style='color:orange' href='#webservice/docs/fullTextGeocoding'>Docs</a>"
							var text = "검색결과(새주소) : " + newAddress + ",\n 응답코드:" + newMatchFlag + "(상세 코드 내역은 " + docs + " 에서 확인)" + "</br> 위경도좌표(중심점) : " + lat + ", " + lon + "</br>위경도좌표(입구점) : " + latEntr + ", " + lonEntr;
							$("#result").html(text);
						} else {
							var docs = "<a style='color:orange' href='#webservice/docs/fullTextGeocoding'>Docs</a>"
							var text = "검색결과(새주소) : " + newAddress + ",\n 응답코드:" + newMatchFlag + "(상세 코드 내역은 " + docs + " 에서 확인)" + "</br> 위경도좌표(입구점) : 위경도좌표(입구점)이 없습니다.";
							$("#result").html(text);
						}
					}
					
					// 구주소일 때 검색 결과 표출
					// 구주소인 경우 newMatchFlag가
					// 아닌 MatchFlag가 응닶값으로
					// 온다
					if (resultCoordinate.matchFlag.length > 0) {
						// 매칭 구분 코드
						matchFlag = resultCoordinate.matchFlag;
					
						// 시/도 명칭
						if (resultCoordinate.city_do.length > 0) {
							city = resultCoordinate.city_do;
							address += city + "\n";
						}
						// 군/구 명칭
						if (resultCoordinate.gu_gun.length > 0) {
							gu_gun = resultCoordinate.gu_gun;
							address += gu_gun+ "\n";
						}
						// 읍면동 명칭
						if (resultCoordinate.eup_myun.length > 0) {
							eup_myun = resultCoordinate.eup_myun;
							address += eup_myun + "\n";
						}
						// 출력 좌표에 해당하는 법정동
						// 명칭
						if (resultCoordinate.legalDong.length > 0) {
							legalDong = resultCoordinate.legalDong;
							address += legalDong + "\n";
						}
						// 출력 좌표에 해당하는 행정동
						// 명칭
						if (resultCoordinate.adminDong.length > 0) {
							adminDong = resultCoordinate.adminDong;
							address += adminDong + "\n";
						}
						// 출력 좌표에 해당하는 리 명칭
						if (resultCoordinate.ri.length > 0) {
							ri = resultCoordinate.ri;
							address += ri + "\n";
						}
						// 출력 좌표에 해당하는 지번 명칭
						if (resultCoordinate.bunji.length > 0) {
							bunji = resultCoordinate.bunji;
							address += bunji + "\n";
						}
						// 출력 좌표에 해당하는 건물 이름
						// 명칭
						if (resultCoordinate.buildingName.length > 0) {
							buildingName = resultCoordinate.buildingName;
							address += buildingName + "\n";
						}
						// 출력 좌표에 해당하는 건물 동을
						// 명칭
						if (resultCoordinate.buildingDong.length > 0) {
							buildingDong = resultCoordinate.buildingDong;
							address += buildingDong + "\n";
						}
						// 검색 결과 표출
						if (lonEntr > 0) {
							var docs = "<a style='color:orange' href='#webservice/docs/fullTextGeocoding'>Docs</a>";
							var text = "검색결과(지번주소) : "+ address+ ","+ "\n"+ "응답코드:"+ matchFlag+ "(상세 코드 내역은 "+ docs+ " 에서 확인)"+ "</br>"+ "위경도좌표(중심점) : "+ lat+ ", "+ lon+ "</br>"+ "위경도좌표(입구점) : "+ latEntr+ ", "+ lonEntr;
							$("#result").html(text);
						} else {
							var docs = "<a style='color:orange' href='#webservice/docs/fullTextGeocoding'>Docs</a>";
							var text = "검색결과(지번주소) : "+ address+ ","+ "\n"+ "응답코드:"+ matchFlag+ "(상세 코드 내역은 "+ docs+ " 에서 확인)"+ "</br>"+ "위경도좌표(입구점) : 위경도좌표(입구점)이 없습니다.";
							$("#result").html(text);
						}
					}
				}
			},
			error : function(request, status, error) {
				console.log(request);
				console.log("code:"+request.status + "\n message:" + request.responseText +"\n error:" + error);
				// 에러가 발생하면 맵을 초기화함
				// markerStartLayer.clearMarkers();
				// 마커초기화
				map.setCenter(new Tmapv2.LatLng(37.570028, 126.986072));
				$("#result").html("");
			
			}
		});

 };