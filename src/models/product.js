const { SimpleModel, dataTypes } = require("../helpers/simpleorm");

const config = {
    code: {
        field: "code",
        type: dataTypes.VARCHAR,
        constraints: {
            primary_key: true,
            unique: true
        }
    },
    name: {
        field: "name",
        type: dataTypes.VARCHAR,
    },
    description: {
        field: "description",
        type: dataTypes.TEXT,
        nullable: true
    }
}

class Product extends SimpleModel {
    static {
        Product.init(config)
    }

    constructor(code, name, description) {
        super()
        this.code = code;
        this.name = name;
        this.description = description;
    }
}

async function main() {
    console.log("Products:", await Product.findAll());
}

main()