const multer = require('multer');

//ce sont les extensions possibles des fichiers images
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//creation d un objet de configuration pour multer qui s enregistrera sur le disque 
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    //creation du nouveau nom de fichier d image pour multer
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_'); //on enleve les espaces
        const extension = MIME_TYPES[file.mimetype];//extension du fichier
        callback(null, name + Date.now() + '.' + extension);//nom de fichier suffisamment unique
  }
});

module.exports = multer({storage: storage}).single('image');