const vendorOnly = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "vendor" ||
      req.user.role === "admin")
  ) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Vendor access required",
  });
};

module.exports = { vendorOnly };