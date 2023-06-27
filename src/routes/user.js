const { Router } = require("express")
const db = require("../db")
const { getAllUsers, updateUser } = require("../controllers/user")

const router = Router()

router.get("/all", getAllUsers)

router.post("/:id", updateUser)

module.exports = router