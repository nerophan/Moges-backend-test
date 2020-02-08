const redis = require('promise-redis')()
const client = redis.createClient({
  host: process.env.redis_host || '127.0.0.1',
  port: process.env.port || 6379
})

module.exports = client