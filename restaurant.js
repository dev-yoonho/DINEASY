//local 저장소에서 유저의 위치 정보와 유저가 요청한 카테고리를 불러온다
var category = window.localStorage.getItem('category');
let locat = window.localStorage.getItem('location');

//카테고리 중 중식과 양식을 json 파일에 저장된 명칭인 중국식과 경양식으로 변환해 주는 함수
function changeCategory(value) {
    let result = value;
    switch(value) {
        case '중식':
            result = '중국식';
            break;
        case '양식':
            result = '경양식';
            break;
    }
    return result;
}

let restaurants; //json파일을 fetch해서 이곳에 저장
let restList = []; //필터링된 식당 리스트가 이곳에 저장

(async () => {
    restaurants = await getRestaurants();
    if (!category) {
        locationRest();
    } else {
        categoryRest();
    }
})()

//json fetch 함수
async function getRestaurants() {
    let res = await fetch('./restaurant.json');
    return res.json();
}
//category가 일치하는 식당 filter 함수
function categoryRest() {
    let filtered = restaurants.filter(restaurant => restaurant.uptaenm == changeCategory(category));
    restList.push(...filtered);

    show(restList, 0);
}
//location에 해당하는 식당 filter 수함수
function locationRest() {
    let filtered = restaurants.filter(restaurant => restaurant.sitewhladdr && restaurant.sitewhladdr.includes(locat));
    restList.push(...filtered);

    show(restList, 1);
}
//식당 리스트를출노출
function show(rests, s) {
    let header = document.querySelector('#header');

    switch(s) {
        case 0: //카테고리 필터로 노출
            header.innerText = "카테고리: " + category;
            break;
        case 1: //위치 필터로 노출
            header.innerText = "위치: " + locat;
            break;
    }

    let parent = document.querySelector('.parent');

    for (let rest of rests) {
        let box = document.createElement('button');
        box.classList.add('buttonRest');
        box.addEventListener('click', () =>
            restSelect(rest));

        let name = document.createElement('b');
        name.classList.add('restaurantName')
        name.innerText = rest.bplcnm;

        let info = document.createElement('p');
        info.classList.add('restaurantInfo');
        info.innerText = '종류: ' + rest.uptaenm + '\n' + '주소: ' + rest.sitewhladdr;

        box.appendChild(name);
        box.appendChild(info);

        parent.appendChild(box);
    }
}
//식당을 선택하여 다음 화면으로 넘어가도록 하는 이벤트 
function restSelect(rest)  {
    var selectedRest = [rest.bplcnm, rest.uptaenm, rest.sitewhladdr];
    var selectedRestStr = JSON.stringify(selectedRest);
    localStorage.setItem('selectedRestaurant', selectedRestStr);
    window.location.href = './Component6.html';
  }
