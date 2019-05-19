const router = require('express').Router()
const controller = require('./item.controller')
const authMiddleware = require('../../../middlewares/auth')

// router.post('/faker', controller.faker);
router.post('', controller.createItems);

router.use('/:start/:size', authMiddleware);
router.get('/:start/:size', controller.getItems);

router.use('/rent', authMiddleware);
router.post('/rent', controller.rentItemByItemId);

module.exports = router;
