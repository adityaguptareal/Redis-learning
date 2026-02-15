const { Redis } = require("ioredis")
const redisClient = new Redis()

redisClient.on("connecting", () => {

    console.log("Redis Get Connecting")
})
redisClient.on("connect", () => {
    console.log("Redis Successfully connected")
})
redisClient.on("error", () => {
    console.log("Error while connecting")
})


module.exports = redisClient