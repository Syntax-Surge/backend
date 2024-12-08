const { User } = require("../../../config/db");
const sendMail = require("../sendMail");
const bcrypt = require('bcrypt'); 

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
          const url = `http://localhost:3000/auth/user/reset/${user.id}`
      
          sendMail(email , url ,"Reset your admin password")
          
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