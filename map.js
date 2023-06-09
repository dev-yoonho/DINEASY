//호수 수정사항 = currentCoords(현재 위치 좌표) 가 로컬에 저장되도록 추가
//호수 수정사항 = targetCoords(음식점 위치 좌표) 가 로컬에 저장되도록 추가
// 다만 AddressToCoordinates(address) 활용하여, 목적지 주소를 좌표로 변환해야함.
// 로컬에 저장된 좌표 사용하려면 불러온 이후 숫자 배열로 변경해야함

var map;
var marker_s, marker_e, marker_p1, marker_p2;
var totalMarkerArr = [];
var drawInfoArr = [];
var resultdrawArr = [];

var lat;
var lon;
var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function initTmap() {
  // map 생성
  // Tmapv2.Map을 이용하여, 지도가 들어갈 div, 넓이, 높이를 설정합니다.
  map = new Tmapv2.Map(
    "map_div", // "map_div" : 지도가 표시될 div의 id
    {
      center: new Tmapv2.LatLng(37.56004728498993, 126.93688499998413), // 지도 초기 좌표
      width: "100%", // map의 width 설정
      height: "400px", // map의 height 설정
      zoom: 17,
    }
  );
  //Marker 객체 생성.
  /*var marker = new Tmapv2.Marker({
		            position: new Tmapv2.LatLng(37.56520450, 126.98602028), //Marker의 중심좌표 설정.
		            map: map //Marker가 표시될 Map 설정..
	            });*/

  // 2. 시작, 도착 심볼찍기
  // 시작
  marker_s = new Tmapv2.Marker({
    position: new Tmapv2.LatLng(currentCoords[0], currentCoords[1]),
    icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
    iconSize: new Tmapv2.Size(24, 38),
    map: map,
  });

  // 도착
  marker_e = new Tmapv2.Marker({
    position: new Tmapv2.LatLng(
      restaurantcoordinates[0],
      restaurantcoordinates[1]
    ),
    icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png",
    iconSize: new Tmapv2.Size(24, 38),
    map: map,
  });

  // 3. 경로탐색 API 사용요청
  var headers = {};
  headers["appKey"] = "KThdzstXSE8XxtqffJ4IC5eV2M9jBSvH59JYlmWW";

  $.ajax({
    method: "POST",
    headers: headers,
    url: "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result",
    async: false,
    data: {
      startX: currentCoords[1],
      startY: currentCoords[0],
      endX: restaurantcoordinates[1],
      endY: restaurantcoordinates[0],
      reqCoordType: "WGS84GEO",
      resCoordType: "EPSG3857",
      startName: "출발지",
      endName: "도착지",
    },
    success: function (response) {
      var resultData = response.features;

      //결과 출력
      var tDistance =
        "총 거리 : " +
        (resultData[0].properties.totalDistance / 1000).toFixed(1) +
        "km,";
      var tTime =
        " 총 시간 : " +
        (resultData[0].properties.totalTime / 60).toFixed(0) +
        "분";

      $("#result").text(tDistance + tTime);

      //기존 그려진 라인 & 마커가 있다면 초기화
      if (resultdrawArr.length > 0) {
        for (var i in resultdrawArr) {
          resultdrawArr[i].setMap(null);
        }
        resultdrawArr = [];
      }

      drawInfoArr = [];

      for (var i in resultData) {
        //for문 [S]
        var geometry = resultData[i].geometry;
        var properties = resultData[i].properties;
        var polyline_;

        if (geometry.type == "LineString") {
          for (var j in geometry.coordinates) {
            // 경로들의 결과값(구간)들을 포인트 객체로 변환
            var latlng = new Tmapv2.Point(
              geometry.coordinates[j][0],
              geometry.coordinates[j][1]
            );
            // 포인트 객체를 받아 좌표값으로 변환
            var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
              latlng
            );
            // 포인트객체의 정보로 좌표값 변환 객체로 저장
            var convertChange = new Tmapv2.LatLng(
              convertPoint._lat,
              convertPoint._lng
            );
            // 배열에 담기
            drawInfoArr.push(convertChange);
          }
        } else {
          var markerImg = "";
          var pType = "";
          var size;

          if (properties.pointType == "S") {
            //출발지 마커
            markerImg =
              "http://tmapapi.sktelecom.com/upload/tmap/markerpin_r_m_s.png";
            pType = "S";
            size = new Tmapv2.Size(24, 38);
          } else if (properties.pointType == "E") {
            //도착지 마커
            markerImg =
              "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png";
            pType = "E";
            size = new Tmapv2.Size(24, 38);
          } else {
            //각 포인트 마커
            markerImg = "http://topopen.tmap.co.kr/imgs/point.png";
            pType = "P";
            size = new Tmapv2.Size(8, 8);
          }

          // 경로들의 결과값들을 포인트 객체로 변환
          var latlon = new Tmapv2.Point(
            geometry.coordinates[0],
            geometry.coordinates[1]
          );

          // 포인트 객체를 받아 좌표값으로 다시 변환
          var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
            latlon
          );

          var routeInfoObj = {
            markerImage: markerImg,
            lng: convertPoint._lng,
            lat: convertPoint._lat,
            pointType: pType,
          };

          // Marker 추가
          marker_p = new Tmapv2.Marker({
            position: new Tmapv2.LatLng(routeInfoObj.lat, routeInfoObj.lng),
            icon: routeInfoObj.markerImage,
            iconSize: size,
            map: map,
          });
        }
      } //for문 [E]
      drawLine(drawInfoArr);
    },
    error: function (request, status, error) {
      console.log(
        "code:" +
          request.status +
          "\n" +
          "message:" +
          request.responseText +
          "\n" +
          "error:" +
          error
      );
    },
  });
}

function addComma(num) {
  var regexp = /\B(?=(\d{3})+(?!\d))/g;
  return num.toString().replace(regexp, ",");
}

function drawLine(arrPoint) {
  var polyline_;

  polyline_ = new Tmapv2.Polyline({
    path: arrPoint,
    strokeColor: "#DD0000",
    strokeWeight: 6,
    map: map,
  });
  resultdrawArr.push(polyline_);
}
var coordinatesAndDescriptions = JSON.parse(localStorage.getItem('coordinatesAndDescriptions'));

console.log("실행됨 0:"+coordinatesAndDescriptions)
let printedDescriptions = new Set();

function success(position) {
  console.log("실행됨 1: "+position);
  (lat = position.coords.latitude), // 위도
    (lon = position.coords.longitude); // 경도

  localStorage.setItem("currentCoords", `${lat}, ${lon}`);

  var locPosition = new Tmapv2.LatLng(lat, lon);

		
	
  coordinatesAndDescriptions.forEach(([dataLat, dataLon, description]) => {
      if (getDistanceFromLatLonInKm(dataLat, dataLon, lat, lon) <= 30 && !printedDescriptions.has(description)) {  
        console.log("실행됨 4"+description);
	var nowDescription=description;
	 var outputDiv = document.getElementById('textOutput'); 
           outputDiv.textContent = description;
	   console.log(nowDescription);
          speech(description);
          printedDescriptions.add(description);
	  if (nowDescription.toString()=="도착"){
	      goNext("Component7")
	  };	  
	  
      }
  });

  // 마커와 인포윈도우를 표시
  displayMaker(locPosition);
}
function error(err) {
  console.log(err);
}
if (navigator.geolocation) {
  var na = navigator.geolocation.watchPosition(success, error, options);
  console.log(na);
}
// 마커 생성기
var marker;
var flag = false;

function displayMaker(locPosition) {
  console.log(1);
  if (flag) {
    marker.setMap(null);
  }
  // 마커를 생성합니다.
  marker = new Tmapv2.Marker({
    position: locPosition,
    map: map,
  });
  marker.setMap(map);
  flag = true;
  map.setCenter(locPosition);
}

// Get the stored coordinates
var coordsString = localStorage.getItem("currentCoords");
// Split the string into parts
var coordsParts = coordsString.split(",");
// Convert each part to a number and store in an array
var currentCoords = coordsParts.map(function (part) {
  return parseFloat(part);
});

// 어드레스에 들어갈 키 값 : selectedRestaurant;

var selectedRestaurant = window.localStorage.getItem("selectedRestaurant");
var restaurantCoordsParts = selectedRestaurant.split(",")[2];

function removeQuotesAndBrackets(sentence) {
  const regex = /['"()\[\]]/g;
  return sentence.replace(regex, '');
}

var result_addr = removeQuotesAndBrackets(restaurantCoordsParts);
var restaurantcoordinates=[];
AddressToCoordinates(result_addr);

function AddressToCoordinates(address) {
  var headers = {};
  headers["appKey"] = "KThdzstXSE8XxtqffJ4IC5eV2M9jBSvH59JYlmWW";
  $.ajax({
    method: "GET",
    headers: headers,
    url: "https://apis.openapi.sk.com/tmap/geo/fullAddrGeo?version=1&format=json&callback=result",
    async: false,
    data: {
      coordType: "WGS84GEO",
      fullAddr: address,
    },
    success: function (response) {
      var resultInfo = response.coordinateInfo; // .coordinate[0];
      if (response.coordinateInfo.coordinate[0].lat != "") {
        console.log(
          `목적지 구주소 기반 x 좌표:` +
            response.coordinateInfo.coordinate[0].lat
        );
        console.log(
          `목적지 구주소 기반 y 좌표:` +
            response.coordinateInfo.coordinate[0].lon
        );
        var restaurantLat = response.coordinateInfo.coordinate[0].lat;
        var restaurantLon = response.coordinateInfo.coordinate[0].lon;
        restaurantcoordinates = [restaurantLat, restaurantLon];
      } else {
        console.log(
          `목적지 신주소 x좌표:` + response.coordinateInfo.coordinate[0].newLat
        );
        console.log(
          `목적지 신주소 y좌표:` + response.coordinateInfo.coordinate[0].newLon
        );
        var restaurantLat = response.coordinateInfo.coordinate[0].newLat;
        var restaurantLon = response.coordinateInfo.coordinate[0].newLon;
        restaurantcoordinates = [restaurantLat, restaurantLon];
      }

      // 3.마커 찍기
      // 검색 결과 정보가 없을 때 처리
      if (resultInfo.coordinate.length == 0) {
        $("#result").text("요청 데이터가 올바르지 않습니다.");
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
          lat = resultCoordinate.newLat;
        }

        var lonEntr, latEntr;

        if (
          resultCoordinate.lonEntr == undefined &&
          resultCoordinate.newLonEntr == undefined
        ) {
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
        var address = "",
          newAddress = "";
        var city, gu_gun, eup_myun, legalDong, adminDong, ri, bunji;
        var buildingName,
          buildingDong,
          newRoadName,
          newBuildingIndex,
          newBuildingName,
          newBuildingDong;

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
            var docs =
              "<a style='color:orange' href='#webservice/docs/fullTextGeocoding'>Docs</a>";
            var text =
              "검색결과(새주소) : " +
              newAddress +
              ",\n 응답코드:" +
              newMatchFlag +
              "(상세 코드 내역은 " +
              docs +
              " 에서 확인)" +
              "</br> 위경도좌표(중심점) : " +
              lat +
              ", " +
              lon +
              "</br>위경도좌표(입구점) : " +
              latEntr +
              ", " +
              lonEntr;
            $("#result").html(text);
          } else {
            var docs =
              "<a style='color:orange' href='#webservice/docs/fullTextGeocoding'>Docs</a>";
            var text =
              "검색결과(새주소) : " +
              newAddress +
              ",\n 응답코드:" +
              newMatchFlag +
              "(상세 코드 내역은 " +
              docs +
              " 에서 확인)" +
              "</br> 위경도좌표(입구점) : 위경도좌표(입구점)이 없습니다.";
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
            address += gu_gun + "\n";
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
            var docs =
              "<a style='color:orange' href='#webservice/docs/fullTextGeocoding'>Docs</a>";
            var text =
              "검색결과(지번주소) : " +
              address +
              "," +
              "\n" +
              "응답코드:" +
              matchFlag +
              "(상세 코드 내역은 " +
              docs +
              " 에서 확인)" +
              "</br>" +
              "위경도좌표(중심점) : " +
              lat +
              ", " +
              lon +
              "</br>" +
              "위경도좌표(입구점) : " +
              latEntr +
              ", " +
              lonEntr;
            $("#result").html(text);
          } else {
            var docs =
              "<a style='color:orange' href='#webservice/docs/fullTextGeocoding'>Docs</a>";
            var text =
              "검색결과(지번주소) : " +
              address +
              "," +
              "\n" +
              "응답코드:" +
              matchFlag +
              "(상세 코드 내역은 " +
              docs +
              " 에서 확인)" +
              "</br>" +
              "위경도좌표(입구점) : 위경도좌표(입구점)이 없습니다.";
            $("#result").html(text);
          }
        }
      }
    },
    error: function (request, status, error) {
      console.log(request);
      console.log(
        "code:" +
          request.status +
          "\n message:" +
          request.responseText +
          "\n error:" +
          error
      );
      // 에러가 발생하면 맵을 초기화함
      // markerStartLayer.clearMarkers();
      // 마커초기화
      map.setCenter(new Tmapv2.LatLng(37.570028, 126.986072));
      $("#result").html("");
    },
  });
}





// 좌표 거리 계산


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
