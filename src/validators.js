const { isUuid } = require("uuidv4");

const validateUuid = (req, res, next) => {
  const { id } = req.params;

  if (!isUuid(id)) return res.status(400).json({ error: "Invalid uuid" });

  res.locals.validated = { id };

  return next();
};

module.exports = { validateUuid };
