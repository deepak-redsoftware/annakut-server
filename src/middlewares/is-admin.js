const isAdmin = (req, res, next) => {
  if (req.user.role === "Admin") {
    next();
  } else {
    res.status(401);
    throw new Error("You must be an admin to perform this action");
  }
};

export default isAdmin;
