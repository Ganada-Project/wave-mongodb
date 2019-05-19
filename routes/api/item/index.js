const router = require('express').Router()
const controller = require('./item.controller')
const authMiddleware = require('../../../middlewares/auth')

// router.post('/faker', controller.faker);
router.post('', controller.createItems);

router.use('/:start/:size', authMiddleware);
router.get('/:start/:size', controller.getItems);

router.use('/rent', authMiddleware);
router.post('/rent', controller.rentItemByItemId);

router.use('/collection', authMiddleware);
router.post('/collection', controller.addCollection);

router.use('/tocollection', authMiddleware);
router.post('/tocollection', controller.addToCollection);

module.exports = router;
