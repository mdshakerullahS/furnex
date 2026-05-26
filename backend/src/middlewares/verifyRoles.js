export const verifyRoles = (allowedRoles) => {
  return (req, res, next) => {
    const currentRole = req.admin?.role;

    if (!req.admin || !allowedRoles.includes(currentRole)) {
      return res.status(403).json({
        message: "Forbidden: You do not have permission to perform this action",
      });
    }

    next();
  };
};
