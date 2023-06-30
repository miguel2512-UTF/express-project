const { Router } = require("express")
const db = require("../db")
const { getAllUsers, getUser, createUser, editUser } = require("../controllers/user")

const router = Router()

router.get("/all", getAllUsers)

router.get("/:id", getUser)

router.post("/create", createUser)

router.post("/:id", editUser)

module.exports = router