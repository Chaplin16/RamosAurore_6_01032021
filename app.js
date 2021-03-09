const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
 
const path = require('path');

//routes
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

//securite
//pour definir les variables d environnement 
require('dotenv').config();

// definit les entetes HTTP
const helmet = require('helmet');

// desinfecte les donnees fournies par l utilisateur
const mongoSanitize = require('express-mongo-sanitize');

// pour limiter le nombre de tentatives d identifications

const rateLimit = require("express-rate-limit");


//connection à la BDD
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.y0gkn.mongodb.net/${process.env.DB_LINK}`,
{   useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
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

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

//SECURITE
app.use(helmet());

// por toutes les requetes
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3 // limit each IP to 3 requests per windowMs
});
app.use(limiter);

app.use(mongoSanitize());
app.use(mongoSanitize({
  replaceWith: '_'
}))



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

module.exports = app;