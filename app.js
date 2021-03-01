const express = require('express');

const app = express();
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const sauce = require('./models/Sauce');
const user = require('./models/User');


mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.jy1jc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
{   useNewUrlParser: true,
    useUnifiedTopology: true })
        .then(() => console.log('Connexion à MongoDB réussie !'))
        .catch(() => console.log('Connexion à MongoDB échouée et ZUT!!!'));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.post('/api/sauce', (req, res, next) => {
    delete req.body._id;
        const sauce =  new Sauce({
            ...req.body
        });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré!'}))
        .catch(error => res.status(400).json({ error: error }));
});


app.use('/api/sauce', (req, res, next) => {
    const sauce = [
        {
            id: 'ObjectId',
            userId: 'String',
            name: 'string',
            manifacturer: 'string',
            description: 'String',
            mainPepper: 'string',
            imageUrl: 'string',
            heat: 'number',
            likes: 'number',
            dislikes: 'number',
            usersLiked:'[string]',
            usersDislikes:'[string]'
        },
    ];
    res.status(200).json(sauce);
  });

module.exports = app;