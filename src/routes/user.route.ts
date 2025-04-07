import { Router } from "express"
import { authMiddleware } from "../middleware/auth.middleware"
import {
  deleteUser,
  getAllUsers,
  getUser,
  login,
  updateUser,
  register,
  logout,
} from "../controllers/user.controller"

const router = Router()

router.post("/register", register)
router.post("/login", login)
router.delete("/logout", authMiddleware, logout)

router.get("/", authMiddleware, getAllUsers)
router.get("/:id", authMiddleware, getUser)
router.put("/:id", authMiddleware, updateUser)
router.delete("/:id", authMiddleware, deleteUser)

export default router
