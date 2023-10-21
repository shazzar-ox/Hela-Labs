// const router = require("express").Router();
import express from "express"
const router = express.Router()
// const {
// voter, result
// } = require("../controllers/manage_fruits")
import { result, voter } from "../controllers/manage_fruits.js"
router.route('/getvote').post(result)
router.route('/vote').post(voter)

// module.exports = router
export { router }