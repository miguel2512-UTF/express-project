const sqlite3 = require("sqlite3")
const md5 = require("md5")

const db = new sqlite3.Database('./db.sqlite3', (err) => {
    if (err) {
        console.error(err.mesage)
    }
    else{
        db.run(`
            CREATE TABLE user (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name text, 
                email text UNIQUE, 
                password text
            )
        `, (err) => {
            if (err) {
                console.log("Error to Create Table User");
            }
            else{
                let insert = `INSERT INTO user (name, email, password) VALUES (?, ?, ?)`
                db.run(insert, ["miguel", "miguel@gmail.com", md5("wilchez8")])
            }
        })
    }
})

module.exports = db