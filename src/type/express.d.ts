declare namespace Express {
  interface Request {
    decodedToken: { userID: number };
  }
}
