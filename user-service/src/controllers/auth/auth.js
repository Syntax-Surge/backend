// const expressAsyncHandler = require("express-async-handler");
// const prisma = require("../../../config/prisma");
// const bcrypt = require('bcrypt');
// const createResponse = require("../../../utils/responseHandler");

// //sign up user
// exports.signUpUser = expressAsyncHandler(async (req, res) => {
//   try {
//       const { email, password,name } = req.body;

//       // Check if required fields are provided
//       if (!email || !password) {
//           return res.status(400).json(createResponse('fail', 400, 'Please fill out all the fields!'));
//       }

//       // Validate email format
//       if (!validateEmail(email)) {
//           return res.status(400).json(createResponse('fail', 400, 'Enter a valid email'));
//       }

//       // Implement stronger password policies here
//       if (password.length < 8) {
//           return res.status(400).json(createResponse('fail', 400, 'Password should be at least 8 characters long!'));
//       }

//       // Check if user already exists
//       const existingUser = await prisma.user.findUnique({
//           where: { email: email },
//       });

//       if (existingUser) {
//           return res.status(409).json(createResponse('fail', 409, 'User already exists with this email. Try logging in.'));
//       }

//       // Hash the password with bcrypt
//       const saltRounds = parseInt(process.env.SALT_ROUNDS) || 12;
//       const hashedPassword = await bcrypt.hash(password, saltRounds);

//       // Create new user record in the database
//       const newUser = await prisma.user.create({
//           data: {
//               email,
//               password: hashedPassword,
//               isVerified: false,
//               name:name
//               // Include additional fields like firstName, lastName, etc. if needed
//           },
//       });

//       if (!newUser) {
//           return res.status(500).json(createResponse('error', 500, 'User not successfully created!'));
//       }

//       // Send the response back with the newly created user information (exclude sensitive fields)
//       return res.status(201).json(createResponse('success', 201, 'User created successfully. Please verify your email to activate your account.', {
//          newUser
//       }));

//       // Optionally, send a verification email here as a background task
//       // e.g., sendVerificationEmail(newUser.email, generateActivationToken(newUser.id));

//   } catch (error) {
//       console.error("Error during user signup:", error.message);
//       return res.status(500).json(createResponse('error', 500, 'Something went wrong during signup.'));
//   }
// });



// const validateEmail = (email) => {
//     console.log(
//       "email validation :" +
//         String(email)
//           .toLowerCase()
//           .match(
//             /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//           )
//     );
//     return String(email)
//       .toLowerCase()
//       .match(
//         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//       );
//   };
 
const bcrypt = require('bcrypt'); 
const db = require('../../config/db');
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
