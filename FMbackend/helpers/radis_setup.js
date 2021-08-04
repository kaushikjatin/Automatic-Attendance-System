const redis = require('redis')

const client = redis.createClient({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_URL,
  password:process.env.REDIS_PWD,
})

client.on('ready', () => {
  console.log('Client connected to redis and ready to use...')
})

client.on('error', (err) => {
  console.error(err.message)
})


module.exports = client