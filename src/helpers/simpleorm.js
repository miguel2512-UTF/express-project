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

    static init(config) {
        const childName = this.name

        if (SimpleOrm.childs.has(childName)) return

        const properties = getProperties(config)

        const sql = properties.map(el => {
            const isNullable = !el.nullable ? "NOT NULL" : ""
            const isPrimaryKey = el.constraints["primary_key"] ? "PRIMARY KEY" : ""
            const isAutoIncrement = el.constraints["auto_increment"] ? "AUTOINCREMENT" : ""
            const isUnique = el.constraints["unique"] ? "UNIQUE" : ""

            return `${el.field} ${el.type} ${isNullable} ${isPrimaryKey} ${isAutoIncrement} ${isUnique}`
        }).join(",")

        db.run(`
        CREATE TABLE IF NOT EXISTS ${childName.toLocaleLowerCase()} (
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

    save() {
        const properties = Object.keys(this)
        const values = Object.values(this)

        const insert = `INSERT INTO ${this.constructor.name.toLocaleLowerCase()} VALUES (${properties.map(el => "?").join(",")})`

        console.log(insert);

        return new Promise(resolve => {
            db.run(insert, values, (err) => {
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
}

const config = {
    id : {
        field: "id",
        type: DATA_TYPES.INTEGER,
        constraints: {
            primary_key: true,
            auto_increment: true,
        }
    },

    firstname : {
        field: "firstname",
        type: DATA_TYPES.VARCHAR,
        nullable: false
    },

    lastname : {
        field: "lastname",
        type: DATA_TYPES.VARCHAR
    },

    email : {
        field: "email",
        type: DATA_TYPES.VARCHAR,
        constraints: {
            unique: true
        }
    }
}

class Usuario extends SimpleOrm {
    
    constructor(id, firstname, lastname, email) {
        super()
        Usuario.init(config)

        this.id = id
        this.firstname = firstname
        this.lastname = lastname
        this.email = email
    }
}

const user = new Usuario(null, firstname="miguel", lastname="wilchez", email="hfghfda");
console.log(user);

async function getResult() {
    const result = await user.save()
    console.log(result);
}

getResult()