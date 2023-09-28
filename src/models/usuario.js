const { dataTypes, SimpleModel } = require("../helpers/simpleorm")

const config = {
    id : {
        field: "id",
        type: dataTypes.INTEGER,
        constraints: {
            primary_key: true,
            auto_increment: true,
        }
    },

    firstname : {
        field: "firstname",
        type: dataTypes.VARCHAR,
        nullable: false
    },

    lastname : {
        field: "lastname",
        type: dataTypes.VARCHAR
    },

    email : {
        field: "email",
        type: dataTypes.VARCHAR,
        constraints: {
            unique: true
        }
    }
}

class Usuario extends SimpleModel {
    static {
        Usuario.init(config)
    }

    constructor(id, firstname, lastname, email) {
        super()

        this.id = id
        this.firstname = firstname
        this.lastname = lastname
        this.email = email
    }
}

async function main() {
    console.log("Users:", await Usuario.findAll());
}

main()