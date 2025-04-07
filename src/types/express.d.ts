export { Request as CustomRequest }

declare namespace Express {
  export interface Request {
    userId?: string
  }
}
