const db = require("../db")
const db2 = require("../db2")

const DEBUG = false

const con = DEBUG ? db2 : db

con.query = DEBUG ? db2.query : db.all

con.awaitQuery = (sql) => {
    return new Promise((resolve, reject) => {
        con.query(sql, (err, results, field) => {
            if (err) {
                resolve(err)
            }
        
            resolve(results, field)
        })
    })
} 

const result = async () => {
    console.log(await con.awaitQuery("SELECT * FROM user"));
}

result()