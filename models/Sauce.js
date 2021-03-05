const mongoose = require('mongoose');
const validator = require('validator');

//modele de sauce
const sauceSchema = mongoose.Schema({ // on utilise la méthode Schema de Mongoose
  userId: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true, 
    minlength:[5,"pas moins de 5 caratères"], 
    maxlengt: [30, "pas plus de 30 caractères"], 
    match: [/^[^@&"<>!_$*€£`+=\/;?#]+$/, "pas de caractère spéciaux"],
  },   
  manufacturer: { 
    type: String, 
    minlength:[5,"pas moins de 5 caratères"], 
    maxlengt: [50, "pas plus de 50 caractères"], 
    match: /^[^@&"<>!_$*€£`+=\/;?#]+$/
  },
  description: { 
    type: String,
    minlength:[15,"pas moins de 15 caratères"], 
    maxlengt: [100, "pas plus de 100 caractères"],  
    match: /^[^@"<>!_$*€£`\/?#]+$/ 
  },
  mainPepper: { 
    type: String, 
    minlength:[5,"pas moins de 5 caratères"], 
    maxlengt: [30, "pas plus de 30 caractères"], 
    match: /^[^@"<>!_$*€£`\/?#]+$/ 
  },
  heat: { type: Number },
  imageUrl: { type: String},
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0},
  usersLiked: { type: Array, default: [] },
  usersDisliked: { type: Array, default: [] },
});



module.exports = mongoose.model('Sauce', sauceSchema);