import verifyToken from "../utils/verify-token.js";

const extractJwtFromHeaders = (req, res, next) => {
  const headers = req.headers;
  const token = headers["authorization"]?.split(" ")[1];
  const user = verifyToken(token);
  if (!token || !user) {
    res.status(401);
    throw new Error("Invalid/Expired token, please login again");
  }
  req.user = user;
  next();
};

export default extractJwtFromHeaders;