declare global {
  namespace Express {
    interface Request {
      static?: any
    }
  }
}
