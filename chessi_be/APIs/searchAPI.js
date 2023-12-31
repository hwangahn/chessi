const express = require('express');
const { handleSearch } = require('../controllers/searchController');

let router = express.Router();

router.get('/api/search', handleSearch)

module.exports = router;