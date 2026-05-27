const errorHandler = (err, req, res, next) => {
  console.error('❌', err.stack || err.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};

module.exports = errorHandler;
