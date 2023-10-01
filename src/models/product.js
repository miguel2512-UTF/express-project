const { SimpleModel, dataTypes } = require("../helpers/simpleorm");

const config = {
    code: {
        field: "code",
        type: dataTypes.VARCHAR,
        constraints: {
            primary_key: true,
            unique: true
        },
        nullable: false
    },
    name: {
        field: "name",
        type: dataTypes.VARCHAR,
        nullable: false
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
    Object.defineProperty(Product, "test", {
        value: "message"
    })
    console.log("Products:", await Product.findAll());
}

main()