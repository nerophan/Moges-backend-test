const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const uploadController = require('../controllers/upload')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../tmp'))
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage });

router.post('/', 
  upload.single('data'),
  uploadController.checkUploadFile,
  uploadController.handleUploadFile
);

module.exports = router;
