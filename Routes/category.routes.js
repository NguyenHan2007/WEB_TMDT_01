const express = require('express');
const router = express.Router();
controllerCategory = require('../Controllers/category.controller');
router.get('/', (req, res) => {
    controllerCategory.loadall(req, res);
});
router.get('/author', (req, res) => {
    controllerCategory.loadauthor(req, res);
});

module.exports = router;