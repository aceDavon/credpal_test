import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import { IUser, User } from "../models/user.model"
import { generateToken } from "../utils/token"
import { isValidObjectId } from "mongoose"

const serializeUser = (user: IUser): Partial<IUser> => {
  const userObject = user.toObject()
  delete userObject.password

  return userObject
}

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body
  try {
    const existing = await User.findOne({ email })
    if (existing) {
      res.status(409).json({ message: "User already exists" })
      return
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashedPassword })

    res.status(201).json({
      data: serializeUser(user as IUser),
      message: "User created successfully, login to continue",
    })
  } catch (error) {
    res.status(400).json({ message: (error as Error).message })
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user || !user.password) {
      res.status(401).json({ message: "Invalid credentials" }) // Unauthorized
      return
    }

    if (typeof user.password !== "string") {
      res.status(500).json({ message: "Password format is invalid" })
      return
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" })
      return
    }

    const token = generateToken(user._id.toString())
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    res.json({ data: serializeUser(user as IUser) })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  })
  res.json({ message: "Logged out successfully" })
}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password")
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-password")
    if (!user) {
      res.status(404).json({ message: "User not found" })
      return
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    if (!isValidObjectId(id)) {
      res.status(400).json({ message: "Invalid user ID format" })
    }

    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password")

    if (!user) {
      res.status(404).json({ message: "User not found" })
    }

    res.json({ data: user, message: "User updated successfully" })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      res.status(404).json({ message: "User not found" })
      return
    }
    res.json({ message: "User deleted" })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}
