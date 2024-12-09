const bcrypt = require('bcrypt'); 
const db = require('../../config/db');
const sendMail = require('./sendMail');
// const { User } = require("../../model/user.model"); // Assuming you have a Sequelize model defined for 'User'
const User = db.User; 
//sign up user
exports.signUpUser = async (req, res) => {
  try {
    console.log('req.body : ', req.body)
    const { email, password, firstName  , contactNo , profileImage} = req.body;

    // Check if required fields are provided
    if (!email || !password || !firstName) {
      return res
        .status(400)
        .json({msg : 'Please fill out all the fields!'});
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({msg :  'Enter a valid email'});
    }

    // Implement stronger password policies here
    if (password.length < 8) {
      return res
        .status(400)
        .json({msg : 'Password should be at least 8 characters long!'});
    }
    console.log('email :', email )
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email : email} });

    if (existingUser) {
      return res
        .status(409)
        .json({msg :'User already exists with this email. Try logging in.'});
    }

    // Hash the password with bcrypt
    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user record in the database
    const newUser = await User.create({
      email,
      password: hashedPassword, 
      firstName,
      contactNo,
      profileImage 
    });

    if (!newUser) {
      return res
        .status(500)
        .json({error :  'User not successfully created!'});
    }

    // Send the response back with the newly created user information (exclude sensitive fields)
    return res.status(200).json({
      msg : 'User created successfully. Please verify your email to activate your account.'
    });

    // Optionally, send a verification email here as a background task
    // e.g., sendVerificationEmail(newUser.email, generateActivationToken(newUser.id));

  } catch (error) {
    console.error("Error during user signup:", error.message);
    return res
      .status(500)
    //   .json({error : 'Something went wrong during signup.'});
      .json({error : error.message});
  }
};



exports.forgotPassword = async (req, res) => {
  try {
        const { email } = req.body;
        console.log('email ', email )
        const user = await User.findOne({ where: { email: email } });
        // const project = await Project.findOne({ where: { title: 'My Title' } });
        if(!user) return res.status(403).json({ message: "User does not  exist!" });
        console.log('user  :', user)
        // const accessToken = generateAccessToken(user._id);
        // console.log("forgotPassword :",user._id);
        // const url = `${CLIENT_URL}/user/reset/${accessToken}`
        const url = `http://localhost:3001/auth/user/reset/${user.id}`
    
        sendMail(email , url ,"Reset your password")
        
        res.status(200).json({ message: "mail sent to reset the password...check ur mail"})

  } catch (error) {
    return res.status(500).json({error : error.message});
  }
};

exports.resetPassword =  async(req, res) => {
  try {
    const {newPassword , userId} = req.body;
    console.log('newPassword : ', newPassword)
    console.log('userId', userId)
    if(!newPassword) return res.status(403).json({ message: "Enter newPassword"})

   const hashedPassword = await bcrypt.hash(newPassword , 12)
   
    await User.update(
      { password: hashedPassword},
      {
        where: {
          id: userId,
        },
      },
    );
    res.status(200).json({ message: "Password changed successfully"})
    console.log(req.user);
  } catch (error) {
    res.status(400).json({ message: error.message});
  }
}


const validateEmail = (email) => {
  console.log(
    "email validation :" +
      String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
  );
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
