const db = require("../db")

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

module.exports = {
    getUserByid
}