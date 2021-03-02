const express = require('express');
const router = express.Router();
const sauceControllers = require('../controllers/sauce');


router.post('/', sauceControllers.createSauce); 
router.put('/:id', sauceControllers.modifySauce);
router.delete('/:id', sauceControllers.deleteSauce);
router.get('/:id', sauceControllers.getOneSauce);
router.get('/', sauceControllers.getAllSauce);
router.post('/:id/like', (req, res, next) => {
   //a faire 
})
module.exports = router;