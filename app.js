const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const sauceRoutes = require('./routes/sauce');

const user = require('./models/User');


mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.jy1jc.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`,
{   useNewUrlParser: true,
    useUnifiedTopology: true })
        .then(() => console.log('Connexion à MongoDB réussie!!AU TOP!!!!'))
        .catch(() => console.log('Connexion à MongoDB échouée et ZUT DE REZUT!!!'));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/api/sauces', sauceRoutes);
module.exports = app;