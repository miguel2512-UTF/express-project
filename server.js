const express = require("express")
const db = require("./src/db")
const md5 = require("md5")

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

app.post("/user/:id", async (req, res, next) => {
    const user = await getUserByid(req.params.id)

    if (!user) {
        return res.status(404).json({ error: "User not found" })
    }

    const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password ? md5(req.body.password) : undefined
    }

    db.run(
        `UPDATE user SET 
        name = COALESCE(?, name),
        email = COALESCE(?, email),
        password = COALESCE(?, password)
        WHERE id = ?
        `,
        [data.name, data.email, data.password, req.params.id],
        function (err) {
            if (err) {
                throw err
            }

            return res.status(200).json({
                status: res.statusCode,
                message: "User Update Successfully",
                fieldChanges: Object.keys(req.body).length
            })
        }
    )
})

app.listen(SERVER_PORT, () => {
    console.log("Server Running in port " + SERVER_PORT);
})

function getUserByid(id) {
    return new Promise(resolve => {
        db.get("SELECT * FROM user WHERE id = ?", [ id ], (err, user) => {
            if (err) {
                resolve(err);
            }

            resolve(user)
        })
    })
}