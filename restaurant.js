var category = window.localStorage.getItem('category')

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

let showNum = 8
const scrollAddition = 4
let restaurants
let categoryRests

(async () => {
    restaurants = await getRestaurants()
    categoryRests = restaurants
    
    show(restaurants, showNum)
    scrollToEnd()

    categoryRest()
    serach()
})()

async function getRestaurants() {
    let res = await fetch('./restaurant.json')

    return res.DATA.json()
}

function show(rests, num) {
    document.querySelector('header').innerText = category + '음식'

    let parent = document.querySelector('parent')

    for (let rest of rests.slice(0, num)) {

        let box = document.createElement('button')
        box.classList.add('buttonRest')

        let img = document.createElement('img')
        img.scr = ''
        img.alt = rest.bplcnm
        img.classList.add('image-icon')

        let name = document.createElement('b')
        name.innerText = rest.bplcnm

        let info = documnet.createElement('p')
        info.innerText = '종류: ' + rest.uptaenm + '\n' + '주소: ' + rest.sitewhladdr

        box.appendChild(name)
        box.appendChild(img)
        box.appendChild(info)

        parent.appendChild(box)

    }
}

function categoryRest() {

    let filtered = restaurants.filter(restaurant => restaurant.uptaenm == changeCategory(category))
    categoryRests.push(...filtered)

    console.log(categoryRests)

    show(categoryRests, showNum)
}

function scrollToEnd() {
    window.scroll = () => {
        let val = window.scrollY + window.innerHeight - document.body.offsetHeight

        if (val == 0) {
            console.log(true)
            showNum += scrollAddition
            show(categoryRests, showNum)
        }
    }
}