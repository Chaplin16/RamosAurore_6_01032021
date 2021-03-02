const express = require('express');
const router = express.Router();

const sauceControllers = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


router.post('', auth, multer, sauceControllers.createSauce); //
router.put('/:id', auth, multer, sauceControllers.modifySauce);
router.delete('/:id', auth, sauceControllers.deleteSauce);//
router.get('/:id', auth, sauceControllers.getOneSauce);
router.get('', auth, sauceControllers.getAllSauces);

//router.post('/:id/like', auth, sauceControllers.likeSauce);

module.exports = router;