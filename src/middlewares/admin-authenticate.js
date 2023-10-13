const jwt = require("jsonwebtoken");
const createError = require("../utils/create-error");

module.exports = async (req, res, next) => {
  try {
    const { isAdmin } = req.user;
    isAdmin === true ? next() : next(createError("unauthenticated", 401));
  } catch (err) {
    next(err);
  }
};
