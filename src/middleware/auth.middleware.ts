import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"

export interface customRequest extends Request {
  userId?: string
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.token
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string
      }
      (req as any).userId = decoded.id as customRequest["userId"]
      next()
    } catch {
      res.status(401).json({ message: "Unauthorized" })
    }
  } else {
    res.status(401).json({ message: "No token provided" })
  }
}
