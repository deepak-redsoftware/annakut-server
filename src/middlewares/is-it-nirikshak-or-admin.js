const isITNirikshakOrAdmin = (req, res, next) => {
    if (req.user.role === 'IT Nirikshak' || req.user.role === 'Admin') {
        next();
    } else {
        res.status(401);
        throw new Error("You must be an IT Nirikshak or an admin to perform this action");
    }
}

export default isITNirikshakOrAdmin;