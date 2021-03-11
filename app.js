const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path'); //donne acces au chemin de notre systeme de fichier

// importation des routes
const sauceRoutes = require('./routes/sauce'); 
const userRoutes = require('./routes/user');

// securite
require('dotenv').config(); //pour definir les variables d environnement 
const helmet = require('helmet'); //definit les entetes HTTP
const mongoSanitize = require('express-mongo-sanitize'); //desinfecte donnees fournies par user
const rateLimit = require("express-rate-limit"); //pour limiter tentative d identifications

//connection à la BDD
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.y0gkn.mongodb.net/${process.env.DB_LINK}`,
{   useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(() => console.log('Connexion à MongoDB réussie!!AU TOP!!!!'))
.catch(() => console.log('Connexion à MongoDB échouée et ZUT DE REZUT!!!'));


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // * = tout le monde peut acceder à l api 
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //methode acceptées
  next();
});

app.use(express.urlencoded({extended: true})); //remplace bodyParser.json() deprecié depuis 2014
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images'))); //creation d un middleware qui va repondre aux requetes envoyées à /images

app.use('/api/sauces', sauceRoutes); //on enregistre les routeurs importés ligne 7
app.use('/api/auth', userRoutes);

//SECURITE
app.use(helmet());

const limiter = rateLimit({ // pour toutes les requetes
  windowMs: 60 * 1000, // 1 minute
  max: 3 //3 requetes max par minute
});
app.use(limiter);

app.use(mongoSanitize());
app.use(mongoSanitize({
  replaceWith: '_'
}))

module.exports = app; //devient accessible pour les autres fichiers


// //options de securité des cookies
// const cookieSession = require('cookie-session'); 

// // cookie-session pour definir les options de securité des cookies
// var expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour
// app.use(cookieSession({
//   name: 'session',
//   keys: ['key1', 'key2'],
//   cookie: { secure: true, //garantie envoi des cookies que par HTTPS
//             httpOnly: true, //garantie que les cookies sont envoyes qu en HTTPS et non au JS du client , contre les attaques croos-site-scripting
//             domain: 'example.com', //indique le domaine du cookie 
//             path: 'foo/bar', //indique le chemin du cookie
//             expires: expiryDate 
//           }
//   })
// );
