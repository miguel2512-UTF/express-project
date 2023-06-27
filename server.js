const express = require("express")
const UserRoutes = require("./src/routes/user")

const app = express()

const SERVER_PORT = 2000

// Middlewares
app.use(express.json())

// Routes
app.use("/user", UserRoutes)

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.get("/hola/:name", (req, res) => {
    // Param
    let name = req.params.name

    // Query Param
    let lastname = req.query["lastname"]

    res.send(`Hello ${name} ${lastname}`)
})

app.get("/json", (req, res) => {
    res.json({
        length: 1,
        data: []
    })
})

app.listen(SERVER_PORT, () => {
    console.log("Server Running in port " + SERVER_PORT);
})