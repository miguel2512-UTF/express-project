const db = require("../db")
const md5 = require("md5")
const { getUserByid, insertUser, updateUser, deleteUser } = require("../helpers/user")

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

const getUser = async (req, res) => {
    const user = await getUserByid(req.params.id)

    if (!user) {
        return res.status(404).send({ 
            status: res.statusCode,
            message: "User not found"
         })
    }
    
    return res.status(200).json({
        status: res.statusCode,
        user
    })
}

const createUser = async (req, res) => {
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password ? md5(req.body.password) : undefined
    }

    if (user){
        console.log(user);
    }

    if (!user) {
        return res.status(400).send({ message: "Body is required" })
    }

    const isSuccess = await insertUser(user)

    if (!isSuccess.success) {
        return res.status(400).json({
            status: res.statusCode,
            message: "user couldn't be created",
            error: isSuccess.message
        })
    }

    return res.status(200).json({
        status: res.statusCode,
        user
    })
}

const editUser = async (req, res, next) => {
    const user = await getUserByid(req.params.id)

    if (!user) {
        return res.status(404).json({ error: "User not found" })
    }

    user.name = req.body.name
    user.email = req.body.email
    user.password = req.body.password ? md5(req.body.password) : undefined

    const isSuccess = await updateUser(user)

    if (!isSuccess.success) {
        return res.status(400).json({
            status: res.statusCode,
            message: "User couldn't be updated",
            error: isSuccess.message
        })
    }
    
    return res.status(200).json({
        status: res.statusCode,
        message: "User updated successfully",
        user: user
    })
}

const removeUser = async (req, res) => {
    const id = req.params.id

    const userExist = await getUserByid(id)
    
    if (!userExist) {
        return res.status(404).json({
            status: res.statusCode,
            message: "User not found"
        })
    }

    const success = await deleteUser(id)
    
    if (!success) {
        return res.status(400).json({
            status: res.statusCode,
            message: "User couldn't be deleted",
            error: success.message
        })
    }

    return res.status(200).json({
        status: res.statusCode,
        message: "User deleted successfully"
    })
}

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    editUser,
    removeUser
}