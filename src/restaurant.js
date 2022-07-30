const restaurantDishes = require("./input.json");

const data1 = restaurantDishes.map(restaurant => {
    return restaurant.restaurant_menu.map(menu => {
        return menu._id.$oid
    })
}).flat(10)

var axios = require('axios');
const types = {"veg": ["pure vegetarian", "eggetarian", "vegan"], "non-veg": ["meat base", "pescatarian", "halal"]};
const cuisineIds = ["6140c599e25b7a002b5a6d53", "6140c599e25b7a002b5a6da8",
    "6140d71f8136640029ba6948", "6140c599e25b7a002b5a6d0d", "6140c599e25b7a002b5a6d5f", "6140c599e25b7a002b5a6d01"]

async function callDSLAPI(type, subType, nativeCuisineId, likedCuisineId) {
    var data = JSON.stringify({
        "subCategory": subType,
        "likedCuisine": [likedCuisineId],
        "nativeCuisine": [nativeCuisineId],
        "likedDishes": [],
        "mainCategory": type,
        "parentAllergies": [],
        "page_no": 0,
        "no_records_on_page": 20
    });

    var config = {
        method: 'post',
        url: 'https://api.pikky.io/ds/api/v1/server2/recommendHome/',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    await axios(config)
        .then(function (response) {

            const recommendedDishIds = response.data.dishes.map(dish => dish.dishId);
            const filteredArray = data1.filter(value => recommendedDishIds.includes(value));
            if (filteredArray.length > 0) {
                console.log(filteredArray)
                console.log("found", nativeCuisineId, likedCuisineId, type, subType)
            } else {
                console.log("not found", nativeCuisineId, likedCuisineId, type, subType)
            }
        })
        .catch(function (error) {
            console.log("error", nativeCuisineId, likedCuisineId, type, subType)
            // console.log(error);
        });
    return {data, config};
}

async function process() {

    for (const cuisineId of cuisineIds) {
        for (const type of Object.keys(types)) {
            for (const subType of types[type]) {
                var {data, config} = await callDSLAPI(type, subType, cuisineId, cuisineId);
            }

        }
    }
}

// process()
callDSLAPI("veg", "pure vegetarian", "6140c599e25b7a002b5a6d5f", "6140c599e25b7a002b5a6d01")

