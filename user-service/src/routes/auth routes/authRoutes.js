const express = require("express");
const passport = require("passport");  
var router = express.Router();  
const { checkAuthentication, checkNotAuthenticated } = require("../../middlewares/auth");
const { signUpUser, forgotPassword, resetPassword } = require("../../controllers/auth/auth");

const bcrypt = require('bcrypt');
var LocalStrategy = require('passport-local');
const { User } = require("../../config/db");
require('../../controllers/auth/strategies')


//sign up user manually
router.post('/signUp' , signUpUser)




passport.use(new LocalStrategy(
  async function (email, password, cb) {
    try {
      console.log('Came hereeeeeeeeeeeeeeee user strat')
      console.log("email",email);
      
      const user = await User.findOne({ where: { email } });   
      // console.log(user);
      
      if (!user) return cb(null, false, { message: 'User not found' });

      const isMatched = await bcrypt.compare(password, user.password);
      if (!isMatched) return cb(null, false, { message: 'Incorrect password' });
      user.role="user";
      const { password: _, ...userData } = user;
      return cb(null, userData);
    } catch (err) {
      return cb(err);
    }
  }
));

passport.serializeUser(function (user, cb) {                //serialize(send user details to create session) user
  process.nextTick(function () {
    cb(null, { id: user.userId, email: user.email, name: user.name,role:user.role });
  });
});

passport.deserializeUser(function(user, cb) {             //de-serialize user (serializeed user)
  process.nextTick(function() {
    return cb(null, user);  
  });  
});  

//login manually
router.post('/login', (req, res, next) => {
  
  console.log("user logged in req") 
  console.log('Session after login:', req.session);

  passport.authenticate('local', (err, user, info) => {
      if (err) {
          // Handle any errors that might occur

          console.log("error send from hereeeeeeee 1")
          console.log('err  - ', err)
          return res.status(500).json({msg : 'Internal server error'});
        }
        
        if (!user) {
          // Return specific error messages
          console.log("error send from hereeeeeeee 2")
          return res.status(401).json({msg : info.message});
        }
        
        // If login is successful, log the user in
        req.logIn(user, (err) => {
          if (err) {
            console.log("error send from hereeeeeeee 3")
              return res.status(500).json({msg : 'Login error'});
          }

          // Successful login
          return res.status(200).json({msg : 'Login successful',user : req.user });
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
         // Construct a redirect URL with user details as query parameters
        // console.log('user :', user);
         const redirectUrl = new URL("http://localhost:3001/");
        //  redirectUrl.searchParams.set("userId", user.id); // Replace with relevant user properties
        //  redirectUrl.searchParams.set("username", user.name); // Example
        //  console.log('redirectUrl.toString() :', redirectUrl.toString() )

           // Set a cookie with user data (e.g., userId, username)
        const cook = res.cookie("user", JSON.stringify({ userId: user.id, username: user.name }), {
          httpOnly: false, // Prevents client-side JS access for security
          secure: true, // Only send over HTTPS
          sameSite: "strict", // Prevents CSRF
          maxAge : 1000 * 60 * 5 , 
        });
        console.log('cook ', cook)
         res.redirect(redirectUrl.toString());
        //  res.status(200).json({ redirectUrl: "http://localhost:3001/" });
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
router.post('/logout',   checkAuthentication,  async (req, res, next) => {
  try {
    console.log('Cookies:', req.cookies); // Check parsed cookies
    console.log('Raw Cookie Header:', req.headers.cookie); // Check raw cookie string
    
    if (!req.cookies || !req.cookies['connect.sid']) {
      return res.status(400).json({ msg: 'Session cookie not found' });
    }
    if (!req.cookies || !req.cookies['user']) {
      res.clearCookie('user', {
        httpOnly: false, // Should match the original cookie settings
        secure: true, // Should match the original cookie settings
        sameSite: "strict", // Should match the original cookie settings
      });
      console.log("User cookie cleared.");
      // return res.status(400).json({ msg: 'Session cookie not found' });
    }
    
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

router.post('/password/forgot-password', forgotPassword )

router.post('/password/reset-password', resetPassword )

  router.get("/user",checkAuthentication, function (req, res, next) {
    res.send(`<h1>Login successfull</h1>`);
  });



module.exports = router;
