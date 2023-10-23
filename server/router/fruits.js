import express from "express"
const router = express.Router()

import { result, voter } from "../controllers/manage_fruits.js"
router.route('/getvote').post(result) // route to get fruit vote
router.route('/vote').post(voter) // route to vote for a fruit

export { router }