const express = require("express")
const db = require("./src/db")

const app = express()

const SERVER_PORT = 2000

// Middlewares
app.use(express.json())

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

app.get("/users", (req, res) => {
    let sql = "SELECT * FROM user"
    let params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status().json({ error: err })
        }
        else {
            return res.json({
                length: rows.length,
                data: rows
            })
        }
    })
})

app.post("/user/:id", (req, res, next) => {
    db.get("SELECT * FROM user WHERE id = ?", [ req.params.id ], (err, row) => {
        if (err) {
           return res.status(400).json({ error: "User dont exist" }) 
        }

        if (!row) {
            return res.status(404).json({ error: "User not found" })
        }
    })

    let data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password ? md5(req.body.password) : null
    }

    console.log("holaaaaaaaaaaaaaaaaaaa");

    db.run(`UPDATE user SET 
        name = COALESCE(?, name),
        email = COALESCE(?, email),
        password = COALESCE(?, password)
        WHERE id = ?
    `,
    [ data.name, data.email, data.password, req.params.id ], 
    function (err) {
        if (err) {
            return res.status(400).json({ error: res.message })
        }
        else {
            return res.status(200).json({
                status: res.statusCode,
                data: data,
                changes: this.changes
            })
        }
    })
})

app.listen(SERVER_PORT, () => {
    console.log("Server Running in port " + SERVER_PORT);
})