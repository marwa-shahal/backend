import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      console.log(token)
      if (!token) {
          return res.status(401).json({ message: "Token Unavailable" });
      }
      const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
      console.log(decoded)
      req.user = decoded;
      next();
  } catch (error) {
      return res
          .status(400)
          .json({ message: "Token is invalid", error: error.message });
  }
};

export default verifyToken;


