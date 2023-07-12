const db = require("../db")
const md5 = require("md5")
const con = require("./test")

const findAllUsers = () => {
    return new Promise(resolve => {
        let sql = "SELECT * FROM user"

        db.all(sql, [], (err, data) => {
            if (err) {
                resolve(err)
            }
            
            resolve(data)
        })
    })
} 

const getUserByid = (id) => {
    return new Promise(resolve => {
        db.get("SELECT * FROM user WHERE id = ?", [id], (err, user) => {
            if (err) {
                resolve(err);
            }

            resolve(user)
        })
    })
}

const insertUser = (user) => {
    return new Promise(resolve => {
        let insert = "INSERT INTO user (name, email, password) VALUES (?, ?, ?)"
        db.run(insert, [user.name, user.email, md5(user.password)], (err) => {
            if (err) {
                resolve({
                    success: false,
                    message: err.message
                });
            }
    
            resolve({
                success: true,
            })
        })
    })
}

const updateUser = (user) => {
    return new Promise(resolve => {
        let update = `UPDATE user SET 
        name = COALESCE(?, name),
        email = COALESCE(?, email),
        password = COALESCE(?, password)
        WHERE id = ?
        `

        db.run(update, [user.name, user.email, user.password, user.id], (err) => {
            if (err) {
                resolve({
                    success: false,
                    message: err.message
                })
            }

            resolve({
                success: true,
            })
        })
    })
}

const deleteUser = (id) => {
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM user WHERE id = ?", [id], (err) => {
            if (err) {
                resolve({
                    success: false,
                    message: err.message
                })
            }

            resolve({
                success: true
            })
        })
    })
}

module.exports = {
    findAllUsers,
    getUserByid,
    insertUser,
    updateUser,
    deleteUser
}