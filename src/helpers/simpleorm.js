const db = require("../db")

const DATA_TYPES = {
    VARCHAR: 'VARCHAR(255)',
    TEXT: 'TEXT',
    INTEGER: 'INTEGER',
    NUMERIC: 'NUMERIC',
    REAL: 'REAL',
    LONG: 'LONG',
    BOOLEAN: 'BOOLEAN',
    BLOB: 'BLOB',
}

class SimpleOrm {

    init() {
        let properties = this.getProperties()

        properties = properties.map(el => {
            return {
                nullable: true,
                constraints: {
                    primary_key: false,
                    auto_increment: false,
                    unique: false
                },
                ...this[el]
            }
        })
        console.log(properties);
        const sql = properties.map(el => `${el.field} ${el.type} ${!el.nullable ? "NOT NULL" : ""} ${el.constraints["primary_key"] ? "PRIMARY KEY" : ""} ${el.constraints["auto_increment"] ? "AUTOINCREMENT" : ""} ${el.constraints["unique"] ? "UNIQUE" : ""}`).join(",")

        console.log(sql);
        db.run(`
        CREATE TABLE IF NOT EXISTS ${this.constructor.name.toLowerCase()} (
            ${sql}
        )
        `, (err) => {
            if (err) {
                console.log("Error to Create Table " + err.message);
            }
        })
    }

    static getProperties() {
        return Object.getOwnPropertyNames(this)
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

class Usuario extends SimpleOrm {

    constructor() {
        super()
        this.init()
    }

    id = {
        field: "id",
        type: DATA_TYPES.INTEGER,
        constraints: {
            primary_key: true,
            auto_increment: true,
        }
    }

    firstname = {
        field: "firstname",
        type: DATA_TYPES.VARCHAR,
        nullable: false
    }

    lastname = {
        field: "lastname",
        type: DATA_TYPES.VARCHAR
    }

    email = {
        field: "email",
        type: DATA_TYPES.VARCHAR,
        constraints: {
            unique: true
        }
    }
}

const user = new Usuario();

async function getResult() {
    const result = await Usuario.findAll()
    console.log(result);
}

// getResult()