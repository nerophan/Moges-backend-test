const path = require('path')
const utils = require('../utils')
const redis = require('../services/redis')
const redisConstant = require('../config/constants/redis')

const idKey = 'ID_INCREMENT'

exports.checkUploadFile = (req, res, next) => {
  const token = utils.getEnv('HIDDEN_TOKEN')
  const body = req.body;
  const file = req.file;
  // check token
  if (token !== body.auth) {
    return res.status(403).send()
  }
  // check content type
  const filetypes = /jpeg|jpg|png/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (!mimetype || !extname) {
    return res.status(403).send({error: 'Unsupported file type'})
  }
  next();
}

exports.handleUploadFile = async (req, res) => {
  const payload = req.body
  const file = req.file;

  // store redis
  // use HINCRBY value as increment id
  const id = await redis.hincrby(redisConstant.APP_KEY, idKey, 1)
  const data = {
    id,
    fileName: file.originalname,
    fileType: file.mimetype,
  }
  console.log(data)
  res.redirect('/')
}