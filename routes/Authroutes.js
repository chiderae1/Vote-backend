const {createUser,illegibleUser,registerUser, validnomination} = require('../controller/Authcontrol')
const {validateUser,validate} = require('../middleware/AuthMiddleware')

const router = require('express').Router()

router.post('/create',validateUser,validate,illegibleUser)
router.post('/register',registerUser)
router.post('/login',createUser)
router.post('/validnomination',validnomination)
// router.post('/create',illegibleUser)

module.exports = router