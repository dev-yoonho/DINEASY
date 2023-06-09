var category = window.localStorage.getItem('category');
let locat = window.localStorage.getItem('userLocation');

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

function changeCategory2(value) {
    let result = value;
    switch(value) {
        case '중국식':
            result = '중식';
            break;
        case '경양식':
            result = '양식';
            break;
    }
    return result;
}

let restaurants;
let restList = [];

(async () => {
    restaurants = await getRestaurants();
    if (!category) {
        locationRest();
        speech(locat + "에 위치한 식당 리스트입니다.");
    } else {
        categoryRest();
        speech(category + " 카테고리에 해당하는 식당 리스트입니다");
    }
})()

async function getRestaurants() {
    let res = await fetch('./restaurant.json');
    return res.json();
}

function categoryRest() {

    let filtered = restaurants.filter(restaurant => restaurant.uptaenm == changeCategory(category));
    restList.push(...filtered);

    show(restList, 0);
}

function locationRest() {

    let filtered = restaurants.filter(restaurant => restaurant.sitewhladdr && restaurant.sitewhladdr.includes(locat));
    restList.push(...filtered);

    show(restList, 1);
}

function show(rests, s) {
    let header = document.querySelector('#header');

    switch(s) {
        case 0:
            header.innerText = "카테고리: " + category;
            break;
        case 1:
            header.innerText = "위치: " + locat;
            break;
    }

    let parent = document.querySelector('.resList');

    for (let rest of rests) {

        let box = document.createElement('button');
        box.classList.add('buttonRest');
        box.addEventListener('click', () =>
            restSelect(rest));

        let box2 = document.createElement('div');

        let name = document.createElement('b');
        name.classList.add('restaurantName');
        name.innerText = rest.bplcnm;

        let info = document.createElement('p');
        info.classList.add('restaurantInfo');
        info.innerText = '종류: ' + changeCategory2(rest.uptaenm) + '\n' + '주소: ' + rest.sitewhladdr;

        let img = document.createElement('img');
        img.classList.add('image-icon');
        img.src = `./restImg/${rest.bplcnm}.png`;
        img.addEventListener("error", ()=> {
            img.src = './restImg/init.png';
        });

        box.appendChild(name);
        box2.appendChild(img);
        box2.appendChild(info);
        box.appendChild(box2);

        parent.appendChild(box);

    }
}

function restSelect(rest)  {
    var selectedRest = [rest.bplcnm, changeCategory2(rest.uptaenm), rest.sitewhladdr];
    var selectedRestStr = JSON.stringify(selectedRest);
    localStorage.setItem('selectedRestaurant', selectedRestStr);
    window.location.href = './Component6.html';
  }
