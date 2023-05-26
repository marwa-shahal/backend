export const accessRoles = (rolesAllowed) => {
    return (req, res, next) => {
      if (rolesAllowed.includes(req.user.role)) {
        return next();
      } else {
        return res
          .status(401)
          .json({ status: "Failed", message: "Not Authorized" });
      }
    };
  };

  