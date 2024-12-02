const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { connectDB , sequelize } = require('./config/db');
// const sequelize = require('sequelize')
const bcrypt = require('bcrypt');
const app = express();
const passport = require('passport');
// const db = require("../src/model/user.model")(sequelize , sequelize.Sequelize);
var session = require('express-session');
const db = require('./config/db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); 

app.use(express.urlencoded({ extended: true }));       //used to metion the ,ublic folder's directory to css in ejs files

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
//   store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' }),
  // store: MongoStore.create({
  //   mongoUrl : process.env.MONGO_DB_URL
  // }),
  cookie : {                                                    //added by  me
    secure : false,                                             //added by  me
    expires : new Date(Date.now() + 10000),                     //added by  me
    maxAge : 1000 * 60                                              //added by  me
} ,
})); 
app.use(passport.authenticate('session'));
// Initialize DB Connection
connectDB();

// Other middlewares and routes setup here

const PORT = process.env.PORT;
db.sequelize.sync().then(function () {
  // app.listen(port, function () {
  //   console.log("server is successfully running!");
  // });
});


const authRoutes = require('./routes/auth routes/authRoutes');
const adminRoutes = require('./routes/auth routes/adminAuthRoutes');
// const db = require('./model');

app.use('/' , authRoutes)
app.use('/admin' , adminRoutes)

const hashedPaswrd = async() => {


  const saltRounds = parseInt(process.env.SALT_ROUNDS) || 12;
  const hashedPassword =await  bcrypt.hash("12341234", saltRounds);
  console.log('hashedPassword :', hashedPassword )
}
// hashedPaswrd();


app.listen(PORT, () => {
  console.log(`Service running on port ${PORT}`);
});
