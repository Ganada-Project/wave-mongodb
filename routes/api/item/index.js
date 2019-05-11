const router = require('express').Router()
const controller = require('./item.controller')
const authMiddleware = require('../../../middlewares/auth')

// router.post('/faker', controller.faker);
router.post('', controller.createItems);
router.get('/:start/:size', controller.getItems);
module.exports = router;
