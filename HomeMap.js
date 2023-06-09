var map;

// 페이지가 로딩이 된 후 호출하는 함수입니다.
function initTmap() {
  // map 생성
  // Tmapv2.Map을 이용하여, 지도가 들어갈 div, 넓이, 높이를 설정합니다.
  map = new Tmapv2.Map(
    "map_div", // "map_div" : 지도가 표시될 div의 id
    {
      center: new Tmapv2.LatLng(37.56004728498993, 126.93688499998413), // 지도 초기 좌표
      width: "362px", // map의 width 설정
      height: "640px", // map의 height 설정
    }
  );
  //Marker 객체 생성.
  var marker = new Tmapv2.Marker({
    position: new Tmapv2.LatLng(37.5652045, 126.98602028), //Marker의 중심좌표 설정.
    map: map, //Marker가 표시될 Map 설정..
  });
}

var homeMapCurrentCoords;
let homeMapCoordsPartslon;
let homeMapCoordsPartslat;
var jibunAddr;

// 변수 선언 후 값 할당
homeMapCoordsPartslon = parseFloat(homeMapCoordsParts[1]);
homeMapCoordsPartslat = parseFloat(homeMapCoordsParts[0]);

function reverseGeo(lon, lat) {
  var headers = {};
  headers["appKey"] = "KThdzstXSE8XxtqffJ4IC5eV2M9jBSvH59JYlmWW";

  $.ajax({
    method: "GET",
    headers: headers,
    url: "https://apis.openapi.sk.com/tmap/geo/reversegeocoding?version=1&format=json&callback=result",
    async: false,
    data: {
      coordType: "WGS84GEO",
      addressType: "A10",
      lon: lon,
      lat: lat,
    },
    success: function (response) {
      // 3. json에서 주소 파싱
      var arrResult = response.addressInfo;

      //법정동 마지막 문자
      var lastLegal = arrResult.legalDong.charAt(
        arrResult.legalDong.length - 1
      );

      // 새주소
      newRoadAddr = arrResult.city_do + " " + arrResult.gu_gun + " ";

      if (
        arrResult.eup_myun == "" &&
        (lastLegal == "읍" || lastLegal == "면")
      ) {
        //읍면
        newRoadAddr += arrResult.legalDong;
      } else {
        newRoadAddr += arrResult.eup_myun;
      }
      newRoadAddr += " " + arrResult.roadName + " " + arrResult.buildingIndex;

      // 새주소 법정동& 건물명 체크
      if (arrResult.legalDong != "" && lastLegal != "읍" && lastLegal != "면") {
        //법정동과 읍면이 같은 경우

        if (arrResult.buildingName != "") {
          //빌딩명 존재하는 경우
          newRoadAddr +=
            " (" + arrResult.legalDong + ", " + arrResult.buildingName + ") ";
        } else {
          newRoadAddr += " (" + arrResult.legalDong + ")";
        }
      } else if (arrResult.buildingName != "") {
        //빌딩명만 존재하는 경우
        newRoadAddr += " (" + arrResult.buildingName + ") ";
      }

      // 구주소
      jibunAddr =
        arrResult.city_do +
        " " +
        arrResult.gu_gun +
        " " +
        arrResult.legalDong +
        " " +
        arrResult.ri +
        " " +
        arrResult.bunji;
      //구주소 빌딩명 존재
      if (arrResult.buildingName != "") {
        //빌딩명만 존재하는 경우
        jibunAddr += " " + arrResult.buildingName;
      }

      result = "새주소 : " + newRoadAddr + "</br>";
      result += "지번주소 : " + jibunAddr + "</br>";
      result += "위경도좌표 : " + lat + ", " + lon;

      var resultDiv = document.getElementById("result");
      resultDiv.innerHTML = result;
      console.log(jibunAddr);
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
///////////////
var homeMapCoordsParts = [];
var lat;
var lon;
var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};
function success(position) {
  console.log(position);
  (lat = position.coords.latitude), // 위도
    (lon = position.coords.longitude); // 경도

  homeMapCurrentCoords = `${lat}, ${lon}`;
  homeMapCoordsParts = homeMapCurrentCoords.split(",");

  var locPosition = new Tmapv2.LatLng(lat, lon);

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

remove();
function remove() {
  map.setOptions({ zoomControl: false }); // 지도 옵션 줌컨트롤 표출 비활성화
}

console.log(homeMapCoordsPartslon);
