var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('/giays',require('./giays'));
router.use('/authors',require('./authors'));
router.use('/side_items',require('./side_items'));
router.use('/users',require('./users'));
router.use('/auth',require('./auth'));
module.exports = router;
