
const express = require("express");
const passport = require("passport"); 
const { checkAuthentication, isAdmin } = require("../../middlewares/auth");
// const { checkAuthentication } = require("../../middlewares/auth");
var router = express.Router(); 
require('../../controllers/auth/admin/strategies');

router.post('/login',  (req, res, next) => {
  
    passport.authenticate('admin-local', (err, user, info) => {
        if (err) {
            // Handle any errors that might occur
            return res.status(500).json({msg : 'Internal server error'});
        }
  
        if (!user) {
            // Return specific error messages
            return res.status(401).json({msg : info.message});
        }
  
        // If login is successful, log the user in
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({msg : 'Login error'});
            }
  
            // Successful login
            return res.status(200).json({msg : 'Login successful',user });
        });
    })(req, res, next);
  });

  
  router.post('/inside', checkAuthentication, isAdmin, async (req, res, next) => {
     console.log(" here came !!");
    return res.status(200).json({msg : 'ggg'})
  })
//logout 
router.get('/logout', checkAuthentication, async (req, res, next) => {
    try {
      // Check if the user is authenticated before attempting to log out
      if (req.isAuthenticated()) {
        // Logout the user and destroy the session
        req.logout(err => {
          if (err) {
            return next(err); // Passes the error to error-handling middleware
          }
  
          // Destroy the session completely
          req.session.destroy(err => {
            if (err) {
              return res.status(500).json({msg : 'Failed to destroy session'}, err.message);
            }
            // Respond with a successful logout message
            res.status(200).json({msg : 'Logout successful'});
          });
        });
      } else {
        // If the user is not authenticated, there's no need to log out
        res.status(400).json({msg : 'No active session to log out from'});
      }
    } catch (err) {
      // Handle unexpected errors
      console.error("Logout error:", err.message);
      res.status(500).json({msg : 'Logout failed'}, err.mssage);
    }
  });


  module.exports = router