const express = require('express');
const router = express.Router();

const sauceControllers = require('../controllers/sauce');
const auth = require('../middleware/auth');


router.post('/', auth, sauceControllers.createSauce); 
router.put('/:id', auth, sauceControllers.modifySauce);
router.delete('/:id', auth, sauceControllers.deleteSauce);
router.get('/:id', auth, sauceControllers.getOneSauce);
router.get('/', auth, sauceControllers.getAllSauce);
router.post('/:id/like', (req, res, next) => {
   //a faire 
})
module.exports = router;