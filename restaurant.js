var category = window.localStorage.getItem('category');

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
let categoryRests = [];

(async () => {
    restaurants = await getRestaurants();
    categoryRest();
})()

async function getRestaurants() {
    let res = await fetch('./restaurant.json');
    return res.json();
}

function categoryRest() {

    let filtered = restaurants.filter(restaurant => restaurant.uptaenm == changeCategory(category));
    categoryRests.push(...filtered);

    show(categoryRests);
}

function show(rests) {
    document.querySelector('#header').innerText = "카테고리: " + category;

    let parent = document.querySelector('.parent');

    for (let rest of rests) {

        let box = document.createElement('button');
        box.classList.add('buttonRest');

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