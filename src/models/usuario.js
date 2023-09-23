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
    try {
        const result = await user.save()
        console.log(result);
    } catch (error) {
        console.log(error);
    }
    const userFind = await Usuario.find("lastname", "wilchez", 2)
    console.log(userFind);
    console.log(userFind?.length);
    console.log(await Usuario.delete(19));
}

getResult()