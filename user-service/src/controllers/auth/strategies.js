const passport = require("passport"); 
var GoogleStrategy = require("passport-google-oauth20").Strategy;
var FacebookStrategy = require("passport-facebook");
var LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const { User } = require("../../config/db");


//google authentication strategy
module.exports = passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      callbackURL: "/oauth2/redirect/google",
    },
    async function (accessToken, refreshToken, profile, callback) {
 console.log('profile ', profile)
      try {
        // console.log("google signin");
        
        let user = await User.findOne({
          where: {
            email: profile.emails[0].value,
          },
        });
        // console.log(user,profile);

        if (user) return callback(null, user);   //return for session creation if user already exists
        console.log('profile.emails[0].value :', profile.emails[0].value )
        console.log('profile.displayName :', profile.displayName )
        console.log('profile.photos[0].value :', profile.photos[0].value )
        user = await User.create({
          email: profile.emails[0].value,
          password: "54343534",  // Placeholder for now; use a secure value
          firstName: profile.name.givenName || "DefaultFirstName", 
          lastName: profile.name.familyName || "DefaultLastName",  // Fallback if missing
          contactNo: "rt24gt2tf",  // Placeholder; replace with a valid value
          profileImage: profile.photos[0].value,
        });
        
        if (user)  return callback(null, user);
      } catch (error) {
        console.error("Error during Google sign-in:", error.message); 
        return callback(error.message);
      }
    }
  )
);




//faceboobk authentication strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env["FACEBOOK_CLIENT_ID"],
      clientSecret: process.env["FACEBOOK_CLIENT_SECRET"],
      callbackURL: "/oauth2/redirect/facebook",
      profileFields: [
        "id",
        "email",
        "gender",
        "picture",
        "link",
        "locale",
        "name",
        "timezone",
        "updated_time",
        "verified",
      ],
      state: true,
    },
    async function verify(accessToken, refreshToken, profile, cb) {


      try {
        console.log('profile :', profile )
        // console.log("facebook signin");
        let user = await User.findOne({
          where: {
            email: profile.emails[0].value,
          },
        });

        if (user) return cb(null, user);
          
        user = await User.create({
          email: profile.emails[0].value,
          password: "54343534",  // Placeholder for now; use a secure value
          firstName: profile.name.givenName || "DefaultFirstName", 
          lastName: profile.name.familyName || "DefaultLastName",  // Fallback if missing
          contactNo: "rt24gt2tf",  // Placeholder; replace with a valid value
          profileImage: profile.photos[0].value,
        });
        console.log("user : ", user);
       
        if (user) return cb(null, user);
      } catch (error) {
        console.log(error.message); // Disconnect on error as well
        return cb(error.message);
      }
    }
  )
);


passport.use(new LocalStrategy(
  async function (email, password, cb) {
    try {
      console.log("email",email);
      
      const user = await User.findOne({ where: { email } });
      console.log(user);
      
      if (!user) return cb(null, false, { message: 'User not found' });

      const isMatched = await bcrypt.compare(password, user.password);
      if (!isMatched) return cb(null, false, { message: 'Incorrect password' });
      user.role="user"
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