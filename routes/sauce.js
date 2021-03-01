const express = require('express');

const router = express.Router();
const sauceModel = require('../models/Sauce');


router.post('/', (req, res, next) => {
    delete req.body.id;
    const sauce =  new Sauce({
        ...req.body
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré'}))
        .catch(error => res.status(400).json({ error }));
});
  
router.put('/:id', (req, res, next) => {
    sauceModel.updateOne({ id: req.params.id }, { ...req.body, id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({ error }));
});

router.delete('/:id', (req, res, next) => {
    sauceModel.deleteOne({ id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
});

router.get('/:id', (req, res, next) => {
    sauceModel.findOne({ id: req.params.id })
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ error }));
});

router.get('/', (req, res, next) => {
    sauceModel.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
});

module.exports = router;