const db = require("../db")

class SimpleOrm {

    constructor() {
        this.init()
    }

    init() {
        db.run(`
        CREATE TABLE IF NOT EXISTS ${this.constructor.name.toLowerCase()} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            email text UNIQUE, 
            password text
        )
        `, (err) => {
            if (err) {
                console.log("Error to Create Table");
            }
        })
    }

    getProperties() {
        return Object.getOwnPropertyNames(this)
    }

    static findAll() {
        return new Promise(resolve => {
            const name = this.name
            const sql = `SELECT * FROM ${name}`

            db.all(sql, [], (err, data) => {
                if (err) {
                    resolve(err)
                }

                resolve(data)
            })
        })
    }
}

class User extends SimpleOrm {

    name = {
        field: "name",
        type: "string"
    }
}

const user = new User();
console.log("USER PROPS", user);

async function getResult() {
    const result = await User.findAll()
    console.log(result);
}

getResult()