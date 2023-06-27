const db = require("../db")
const md5 = require("md5")
const { getUserByid } = require("../helpers/user")

const getAllUsers = (req, res) => {
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
}

const updateUser = async (req, res, next) => {
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
}

module.exports = {
    getAllUsers,
    updateUser
}