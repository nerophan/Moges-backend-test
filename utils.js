const Mustache = require('mustache')
const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
const env = dotenv.config().parsed

const template = fs.readFileSync(path.join(__dirname, 'public/index.html'), 'utf8')

exports.generateHtml = () => {
  return Mustache.render(template, { hiddenToken: env.HIDDEN_TOKEN });
}

exports.getEnv = key => env[key]
