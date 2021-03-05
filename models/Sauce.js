const mongoose = require('mongoose');

//modele de sauce
const sauceSchema = mongoose.Schema({ // on utilise la méthode Schema de Mongoose
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String },
    description: { type: String },
    mainPepper: { type: String },
    heat: { type: Number },
    imageUrl: { type: String },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0},
    usersLiked: { type: Array, default: [] },
    usersDisliked: { type: Array, default: [] },
  });

module.exports = mongoose.model('Sauce', sauceSchema);