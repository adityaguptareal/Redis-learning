const { default: axios } = require("axios")
const client = require("./utils/redisClient")
const express = require("express")
const cachedData = require("./middleware/cachedData")
const redisClient = require("./utils/redisClient")
const app = express()


app.get("/products", cachedData("products"), async (req, res) => {
    const { data: productsData } = await axios.get("https://dummyjson.com/products")
    await redisClient.setex("products", 15, JSON.stringify(productsData))
    res.send(productsData)
})

app.get("/products/:id", async (req, res) => {
    const productId = req.params.id
    cachedData(`products:${productId}`)
    const { data: productsData } = await axios.get(`https://dummyjson.com/products/${productId}`)
    await redisClient.setex(`products:${productId}`, 60, JSON.stringify(productsData))
    res.send(productsData)
})

app.get("/", async (req, res) => {
    const cashedValue = await client.get("todoslist")
    if (cashedValue) {
        res.json(JSON.parse(cashedValue))
        return;
    }
    const { data } = await axios.get("https://jsonplaceholder.typicode.com/todos")
    await client.setex("todoslist", 20, JSON.stringify(data))
    res.json(data)
})

app.listen(3000, () => {
    console.log("App is running at port", 3000)
})