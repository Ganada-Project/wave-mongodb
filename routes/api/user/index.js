const router = require('express').Router()
const controller = require('./user.controller')

router.get('/list', controller.list)
router.get('/me', controller.me);
router.post('/assign-admin/:username', controller.assignAdmin)

router.post('/fcm', controller.updateFCM);

module.exports = router