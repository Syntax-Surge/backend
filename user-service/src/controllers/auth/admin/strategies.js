const passport = require("passport"); 
var LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const {  Admin } = require("../../../config/db");

passport.use('admin-local',new LocalStrategy(
    async function (email, password, cb) {
      try {
        console.log('Came hereeeeeeeeeeeeeeee admin strat')
        console.log("email",email);
        
        const user = await Admin.findOne({ where: { email } });
        console.log(user);
        
        if (!user) return cb(null, false, { message: 'Admin not found' });
  
        const isMatched = await bcrypt.compare(password, user.password);
        console.log('user.password :', user.password)
      console.log('isMatched :', isMatched)

        if (!isMatched) return cb(null, false, { message: 'Incorrect password' });
        const userData={"id":user.dataValues.id,"email":user.dataValues.email,"role":"user"}
        // user.role="admin";
        // const { password: _, ...userData } = user;
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