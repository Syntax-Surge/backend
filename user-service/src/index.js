const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { connectDB , sequelize } = require('./config/db');
const bcrypt = require('bcrypt');
const app = express();
const passport = require('passport');
var session = require('express-session');
const db = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin: [ "http://localhost:3001" , "http://localhost:3000" ] ,credentials: true} )); 
app.use(cookieParser());
// app.use(cors({ credentials: true })); 
     

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie : {                                                    //added by  me
    secure : false,                                             //added by  me
    expires : new Date(Date.now() + 10000),                     //added by  me
    maxAge : 1000 * 60 ,    
    httpOnly : true                                   //added by  me
} ,
})); 
app.use(passport.authenticate('session'));
// Initialize DB Connection
connectDB();


app.use((req, res, next) => {
  console.log('Incoming Cookies:', req.cookies);
  console.log('Session:', req.session);
  next();
});

// Other middlewares and routes setup here

const PORT = process.env.PORT;
db.sequelize.sync().then(function () {});





const PRODUCTS_SERVICE = 'http://localhost:3004';
const ORDER_SERVICE = 'http://localhost:3005';

app.use('/api/products', createProxyMiddleware({ target: PRODUCTS_SERVICE, changeOrigin: true }));
app.use('/api/order', createProxyMiddleware({ target: ORDER_SERVICE, changeOrigin: true }));


const authRoutes = require('./routes/auth routes/authRoutes');
const adminRoutes = require('./routes/auth routes/adminAuthRoutes');
const globalErrorHandler = require('./middlewares/globalErrorHandler');
const apiErrorHandler = require('./middlewares/apiErrorHandler');


app.use('/' , authRoutes)
app.use('/admin' , adminRoutes)

// const hashedPaswrd = async() => {
//   const saltRounds = parseInt(process.env.SALT_ROUNDS) || 12;
//   const hashedPassword =await  bcrypt.hash("12341234", saltRounds);
//   console.log('hashedPassword :', hashedPassword )
// }
// hashedPaswrd();

app.use('/api/v1/users', userRoutes);




app.use('/api/v1/users', userRoutes);
// app.use('/api/v1/error',apiErrorHandler, createError);



// app.use(globalErrorHandler)
// router.use(apiErrorHandler);




app.listen(PORT, () => {
  console.log(`Service running on port ${PORT}`);
});
