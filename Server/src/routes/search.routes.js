import express from "express"
import { SearchResults } from "../controller/search.controller.js"
const router = express.Router()

router.get("/", SearchResults)


export default router