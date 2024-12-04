const express = require('express');
const router = express.Router();
const filter = require("../controllers/filter/filter.controller")

router.get('/', filter);


module.exports = router;
