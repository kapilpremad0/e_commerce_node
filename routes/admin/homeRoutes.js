const express = require('express');
const router = express.Router();
const homeController = require('../../controllers/admin/homeController');

router.get('/', homeController.home);

module.exports = router;