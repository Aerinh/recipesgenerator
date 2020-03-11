const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

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

router.post('/search',  function(req, res, next) {
    const category = req.body.category;
    const area = req.body.area;
    const ingredient = req.body.ingredient;
    // todo implement search by category and ingredient
    fetch('https://www.themealdb.com/api/json/v1/1/filter.php?a=' + area)
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

module.exports = router;
