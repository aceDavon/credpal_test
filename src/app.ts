import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import userRoutes from "./routes/user.route"

dotenv.config()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use("/api/users", userRoutes)

export default app
