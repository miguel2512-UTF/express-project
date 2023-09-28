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
    const properties = Object.getOwnPropertyNames(object).map(el => {
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
    static #childs = new Set()
    static _initialized = false

    static init(config) {
        const childName = this.name

        if (SimpleOrm.#childs.has(childName)) return

        const properties = getProperties(config)

        this.config = properties

        const sql = properties.map(el => {
            const isNullable = !el.nullable ? "NOT NULL" : ""
            const isPrimaryKey = el.constraints["primary_key"] ? "PRIMARY KEY" : ""
            const isAutoIncrement = el.constraints["auto_increment"] ? "AUTOINCREMENT" : ""
            const isUnique = el.constraints["unique"] ? "UNIQUE" : ""

            const field = [
                el.field,
                el.type,
                isNullable,
                isPrimaryKey,
                isAutoIncrement,
                isUnique
            ].filter(el => el).join(" ")

            return field
        }).join(",")

        db.run(`
        CREATE TABLE IF NOT EXISTS ${childName.toLocaleLowerCase()} (
            ${sql}
        )
        `, (err) => {
            if (err) {
                console.log("Error to Create Table " + err.message);
            }

            this._initialized = true
            SimpleOrm.#childs.add(childName)
        })
    }

    static _waitForInitialize() {
        if (this._initialized) return

        return new Promise(resolve => {
            const interval = setInterval(() => {
                console.log("initializing...", this.name);
                if (this._initialized) {
                    resolve()
                    clearInterval(interval)
                }
            }, 100)
        })
    }

    static async findAll() {
        await this._waitForInitialize()

        return new Promise((resolve, reject) => {
            const name = this.name
            const sql = `SELECT * FROM ${name}`

            db.all(sql, [], (err, data) => {
                if (err) {
                    reject(err)
                }

                resolve(data)
            })
        })
    }

    static async find(field, value, limit = 1) {
        await this._waitForInitialize()

        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM ${this.name} WHERE ${field} = ? LIMIT ${limit}`, [value], (err, data) => {
                if (err) {
                    reject(err);
                }

                if (data.length == 0) resolve(null)

                if (limit == 1) resolve(data[0])

                resolve(data)
            })
        })
    }

    /**
    @param {String} field
    @return {Promise<boolean>}
    */
    static async delete(field, value) {
        await this._waitForInitialize()

        return new Promise(async (resolve, reject) => {
            if (await this.find(field, value) == null) {
                resolve(false)
            }

            db.run(`DELETE FROM ${this.name} WHERE ${field} = ?`, [value], (err) => {
                if (err) {
                    reject(err)
                }

                resolve(true)
            })
        })
    }

    save() {
        const properties = Object.keys(this)
        const values = Object.values(this)

        const insert = `INSERT INTO ${this.constructor.name.toLocaleLowerCase()} (${properties.join(",")}) VALUES (${properties.map(el => "?").join(",")})`

        console.log(insert);

        return new Promise((resolve, reject) => {
            db.run(insert, values, (err) => {
                if (err) {
                    reject(err)
                }

                resolve({
                    success: true
                })
            })
        })
    }

    static async deleteByPrimaryKey(value) {
        await this._waitForInitialize()
        return `${this.getPrimaryKeyField()}, ${value}`
    }

    static getPrimaryKeyField() {
        const primaryKey = this.config.find(property => property.constraints.primary_key)
        return primaryKey.field
    }
}

module.exports = {
    dataTypes: DATA_TYPES,
    SimpleModel: SimpleOrm
}