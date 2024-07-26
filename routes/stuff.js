const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const router = express.Router();




const stuffCtrl = require('../controllers/stuff');

router.post('/', auth, multer, stuffCtrl.createThing);
router.get('/:id',auth, stuffCtrl.getOneThing);
router.get('/', auth, stuffCtrl.getAllStuff);
router.put('/:id', auth, multer, stuffCtrl.modifyThing);
router.delete('/:id',auth, stuffCtrl.deleteThing);


module.exports = router;