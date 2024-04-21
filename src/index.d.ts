declare namespace Express {
  export interface Request {
    decodedToken: { userID: number };
  }
}
