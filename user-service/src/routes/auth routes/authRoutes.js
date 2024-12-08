const express = require("express");
const passport = require("passport"); 
var router = express.Router(); 
require('../../controllers/auth/strategies');  
const { checkAuthentication, checkNotAuthenticated } = require("../../middlewares/auth");
const { signUpUser } = require("../../controllers/auth/auth");

//loading page
// router.get("/" , checkAuthentication,(req,res,next) => {
//   res.render('home');
 
// })

//login/signin dialog
// router.get("/loginDialog" , checkNotAuthenticated, (req,res,next) => {
//  res.render('login');
// })


//sign up user manually
router.post('/signUp' , signUpUser)

//login manually
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
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
          return res.status(200).json({ msg: 'Login successful', user });
      });
  })(req, res, next);
});
  


//google authentication
router.get(
    "/login/federated/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);  

router.get(
  "/oauth2/redirect/google", 
  checkNotAuthenticated,
  (req, res, next) => {
    passport.authenticate("google", (err, user, info) => {
      console.log('first')
      if (err) {
        return res.status(500).json({ msg: 'Internal server error', error: err.message });
      }
      if (!user) {
        return res.status(401).json({ msg: 'Authentication failed' });
      }
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ msg: 'Login error', error: loginErr.message });
        }
        // Successful login
        res.redirect("http://localhost:3000/"); // Adjust as needed
      });
    })(req, res, next);
  }
);



//facebook authentication
  router.get('/login/federated/facebook', passport.authenticate('facebook' ));
  
  router.get('/oauth2/redirect/facebook', checkNotAuthenticated, (req, res, next) => {
    passport.authenticate("facebook", (err, user, info) => {
      if (err) {
        // Handle the error and send a JSON response
        return res.status(500).json({msg : 'Internal server error', err });
      }
  
      if (!user) {
        // Authentication failed, send a specific error message
        return res.status(400).json({msg : 'Authentication failed', info});
      }
  
      // If authentication is successful, log in the user
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          // Handle login error
          return res.status(500).json({msg : 'Login error',loginErr});
        }
  
        // Successful login, send user information
        return res.status(200).json({msg : 'Login successful', user });

        // res.redirect("http://localhost:3000/");
      });
    })(req, res, next); // Invoke the authenticate function with req, res, next
  });
  





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



  router.get("/user",checkAuthentication, function (req, res, next) {
    res.send(`<h1>Login successfull</h1>`);
  });



module.exports = router;
