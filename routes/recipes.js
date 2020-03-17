const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

function convertMeal(meal) {
    return {
        name: meal.strMeal,
        image: meal.strMealThumb,
        id: meal.idMeal
    }
}

function filterEmptyElementFromArray(array) {
    return array.filter(function (el) {
        return el != null && el !== "";
    });
}

function convertMealDetails(m) {
    return {
        id: m.idMeal,
        name: m.strMeal,
        category: m.strCategory,
        area: m.strArea,
        instructions: m.strInstructions,
        image: m.strMealThumb,
        tags: m.strTags,
        youtube: m.strYoutube,
        ingredients: filterEmptyElementFromArray([
            // yes the api we are using is ugly
            m.strIngredient1, m.strIngredient2, m.strIngredient3, m.strIngredient4, m.strIngredient5,
            m.strIngredient6, m.strIngredient7, m.strIngredient8, m.strIngredient9, m.strIngredient10,
            m.strIngredient11, m.strIngredient12, m.strIngredient13, m.strIngredient14, m.strIngredient15,
            m.strIngredient16, m.strIngredient17, m.strIngredient18, m.strIngredient19, m.strIngredient20
        ]),
        measures: filterEmptyElementFromArray([
            // yes the api we are using is ugly
            m.strMeasure1, m.strMeasure2, m.strMeasure3, m.strMeasure4, m.strMeasure5,
            m.strMeasure6, m.strMeasure7, m.strMeasure8, m.strMeasure9, m.strMeasure10,
            m.strMeasure11, m.strMeasure12, m.strMeasure13, m.strMeasure14, m.strMeasure15,
            m.strMeasure16, m.strMeasure17, m.strMeasure18, m.strMeasure19, m.strMeasure20
        ])
    }
}

/* GET recipes listing. */
router.get('/', function(req, res, next) {
    res.send(JSON.stringify('respond with a resource'));
});

router.get('/categories/detailed', function(req, res, next) {
    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
        // todo parse correctly
        .then(resp=> resp.text()).then(body => res.send(body)) ;
});

router.get('/categories', function(req, res, next) {
    fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list')
        .then(resp => resp.text())
        .then(body => JSON.parse(body))
        .then(json => {
            if (json == null || json.meals == null) {
                return [];
            }
            let categories = [];
            json.meals.forEach(c => categories.push(c.strCategory))
            return categories;
        })
        .then(categories => res.send(categories));
});

router.get('/areas', function(req, res, next) {
    fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
        .then(resp => resp.text())
        .then(body => JSON.parse(body))
        .then(json => {
            if (json == null || json.meals == null) {
                return [];
            }
            let areas = [];
            json.meals.forEach(c => areas.push(c.strArea))
            return areas;
        })
        .then(areas => res.send(areas));
});

router.get('/ingredients', function(req, res, next) {
    fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list')
        .then(resp => resp.text())
        .then(body => JSON.parse(body))
        .then(json => {
            if (json == null || json.meals == null) {
                return [];
            }
            let ingredients = [];
            json.meals.forEach(c => ingredients.push(c.strIngredient))
            return ingredients;
        })
        .then(ingredients => res.send(ingredients));
});

router.post('/search/category',  function(req, res, next) {
    const category = req.body.category;
    fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=' + category)
        .then(resp => resp.text())
        .then(body => JSON.parse(body))
        .then(json => {
            if (json == null || json.meals == null) {
                return [];
            }
            let meals = [];
            json.meals.forEach(m => meals.push(convertMeal(m)));
            return meals;
        })
        .then(meals => res.send(meals));
});

router.post('/search/area',  function(req, res, next) {
    const area = req.body.area;
    fetch('https://www.themealdb.com/api/json/v1/1/filter.php?a=' + area)
        .then(resp => resp.text())
        .then(body => JSON.parse(body))
        .then(json => {
            if (json == null || json.meals == null) {
                return [];
            }
            let meals = [];
            json.meals.forEach(m => meals.push(convertMeal(m)));
            return meals;
        })
        .then(meals => res.send(meals));
});

router.post('/search/ingredient',  function(req, res, next) {
    const ingredient = req.body.ingredient;
    fetch('https://www.themealdb.com/api/json/v1/1/filter.php?i=' + ingredient)
        .then(resp => resp.text())
        .then(body => JSON.parse(body))
        .then(json => {
            if (json == null || json.meals == null) {
                return [];
            }
            let meals = [];
            json.meals.forEach(m => meals.push(convertMeal(m)));
            return meals;
        })
        .then(meals => res.send(meals));
});

router.post('/search/name',  function(req, res, next) {
    const name = req.body.name;
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + name)
        .then(resp => resp.text())
        .then(body => JSON.parse(body))
        .then(json => {
            if (json == null || json.meals == null) {
                return [];
            }
            let meals = [];
            json.meals.forEach(c => meals.push(c.strMeal))
            return meals;
        })
        .then(meals => res.send(meals));
});

router.post('/search/id',  function(req, res, next) {
    const id = req.body.id;
    fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id)
        .then(resp => resp.text())
        .then(body => JSON.parse(body))
        .then(json => {
            if (json == null || json.meals == null || json.meals.length === 0) {
                return {};
            }
            return convertMealDetails(json.meals[0])
        })
        .then(meals => res.send(meals));
});







module.exports = router;
