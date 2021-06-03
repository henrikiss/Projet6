const express = require('express');
const router = express.Router();
const sauceAuth = require("../middleware/sauceAuth.js");
const xssSauce = require("../middleware/xss-sauce.js");
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');



router.get('/',auth, sauceCtrl.getAllSauces);
router.get('/:id',auth, sauceCtrl.getSauceById);
router.post('/',auth, multer,sauceCtrl.addSauce);
router.put('/:id',auth,  multer,sauceCtrl.updateSauce);
router.delete('/:id',auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.likeDislikeSauce);


module.exports = router;