var category = '한식' //window.localStorage.getItem('category');
let locat = window.localStorage.getItem('location');

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

let restaurants;
let restList = [];

(async () => {
    restaurants = await getRestaurants();
    if (!category) {
        locationRest();
    } else {
        categoryRest();
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

function restSelect(rest)  {
    var selectedRest = [rest.bplcnm, rest.uptaenm, rest.sitewhladdr];
    var selectedRestStr = JSON.stringify(selectedRest);
    localStorage.setItem('selectedRestaurant', selectedRestStr);
    window.location.href = './Component6.html';
  }