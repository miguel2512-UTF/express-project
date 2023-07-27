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

function getProperties(object) {
    let properties = Object.getOwnPropertyNames(object)
    properties = properties.map(el => {
        return {
            nullable: true,
            constraints: {
                primary_key: false,
                auto_increment: false,
                unique: false
            },
            ...object[el]
        }
    })

    return properties
}

class SimpleOrm {
    static childs = new Set()

    init() {
        const childName = this.constructor.name

        if (SimpleOrm.childs.has(childName)) return

        const properties = getProperties(this)

        const sql = properties.map(el => {
            const isNullable = !el.nullable ? "NOT NULL" : ""
            const isPrimaryKey = el.constraints["primary_key"] ? "PRIMARY KEY" : ""
            const isAutoIncrement = el.constraints["auto_increment"] ? "AUTOINCREMENT" : ""
            const isUnique = el.constraints["unique"] ? "UNIQUE" : ""

            return `${el.field} ${el.type} ${isNullable} ${isPrimaryKey} ${isAutoIncrement} ${isUnique}`
        }).join(",")

        db.run(`
        CREATE TABLE IF NOT EXISTS ${this.constructor.name.toLowerCase()} (
            ${sql}
        )
        `, (err) => {
            if (err) {
                console.log("Error to Create Table " + err.message);
            }
        })

        SimpleOrm.childs.add(childName)
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

    static save() {

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