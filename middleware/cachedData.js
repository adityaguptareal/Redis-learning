const redisClient = require("../utils/redisClient")

function cachedData(key) {
    return async (req, res, next) => {
        try {
            console.log("cached data")
            const getData = await redisClient.get(key)
            if (getData) {
                res.send(JSON.parse(getData))
                return
            }
            next()
        } catch (error) {
            console.log(error)
            next()
        }

    }
}
module.exports = cachedData