const express = require('express');
const search = require('../../controllers/search/search.controller');
const filter = require('../../controllers/filter/filter.controller');

const router = express.Router();

router.get('/search',search);
router.get('/filter',filter);

module.exports = router;