const router = require('express').Router();

const {register,login,changepass} = require('../controllers/Student_Ragistration.controllers')

router.post('/rtn',register)
router.post('/log',login)
router.post('/cngpass',changepass)

module.exports = router;