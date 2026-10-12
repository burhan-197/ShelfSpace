// Guards API routes that need MongoDB. When the server is started with
// SKIP_DB=1 (UI-only work) or the database connection drops, API clients
// get a clean, documented 503 envelope instead of a crash or hang.
const mongoose = require('mongoose');
const AppError = require('../utils/AppError');

function dbGuard(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return next(new AppError('Database is not connected', 503));
  }
  next();
}

module.exports = dbGuard;
