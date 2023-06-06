const withAuth = (req, res, next) => {
  // If the user is not logged in, redirect the request to the login route
  if (!req.session.logged_in) {
    res.redirect('/login');
  } else {
    next();
  }
};

module.exports = withAuth;


// custom middleware verifies that the client is logged in. If not, it will redirect to the login page. Once verified it will move on to the next part of the function