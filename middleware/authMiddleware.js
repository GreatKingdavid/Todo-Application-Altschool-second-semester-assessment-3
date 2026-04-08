const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(`[LOG]: Auth Error - ${err.message}`);
        res.redirect('/login');
      } else {
        // Successful login - store user ID in the request object
        req.user = decodedToken;
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

// Exporting as an object so we can add more middleware later if needed
module.exports = { requireAuth };