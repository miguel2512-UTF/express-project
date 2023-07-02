const { Router } = require("express")
const db = require("../db")
const { getAllUsers, getUser, createUser, editUser, removeUser } = require("../controllers/user")

const router = Router()

router.get("/all", getAllUsers)

router.get("/:id", getUser)

router.post("/create", createUser)

router.post("/:id", editUser)

router.delete("/:id", removeUser)

module.exports = router