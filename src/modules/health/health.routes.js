const express = require('express')
const router = express.Router()
const healthController = require('./health.controller')

router.get('/health', healthController.getHealth)
router.get('/ping', healthController.getPing)

module.exports = router
