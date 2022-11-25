module.exports = {
    checkAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      res.redirect(`/login/?retUrl=${req.originalUrl}`);
    },
  };
  