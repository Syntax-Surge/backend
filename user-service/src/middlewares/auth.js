

exports.checkAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("Authenticated user:", req.user); // Log the authenticated user for debugging
    return next(); // User is authenticated, proceed to the next middleware
  } else {
    // User is not authenticated
    console.log("Unauthenticated request for:", req.originalUrl);
      // For AJAX requests, send a JSON response instead of redirecting
      return res.status(401).json({msg : "Unauthorized, please log in."});
    
  }
}

exports.checkNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    // Log the attempt by an authenticated user to access a non-auth route
    console.log("Authenticated user:", req.user.username); 


      // For API requests, respond with JSON
      return res.status(403).json({msg : "Forbidden: You are already logged in."});
  
  }

  // Proceed for non-authenticated users
  next();
};

