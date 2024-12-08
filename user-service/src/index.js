const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { connectDB , sequelize } = require('./config/db');
const app = express();
const passport = require('passport');
var session = require('express-session');
const db = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const {RedisStore} = require("connect-redis")
const redis = require('redis');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); 
app.use(cookieParser());

// Configure Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
  retry_strategy: (options) => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      console.error('Redis connection refused');
      return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 5) {
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000); // Reconnect after increasing delay
  },
});

// console.log('RedisStore:', RedisStore);
redisClient.on('error', (err) => console.error('Redis Client Error:', err));

// // Connect Redis client
(async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis successfully');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
})();

console.log('Redis Client Status:', redisClient.isOpen ? 'Connected' : 'Not Connected');



const sessionMiddleware = session({
  //store: new RedisStore({ client: redisClient }),
  store: new RedisStore({
    client: redisClient,
    logErrors: true, // Enable logging errors in RedisStore
  }), // Use RedisStore factory function
  secret:'plant',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // Set to true in production
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  },
});

// // Apply session middleware
app.use(sessionMiddleware, async (req, res, next) => {
  console.log("Session data middleware triggered");

  // Assuming sessionMiddleware has added session data to `req.sessionData`
  if (req.sessionData) {
    console.log(req.sessionData);
    
    // Set session data in Redis with sessionId as the key
    await redisClient.set(`session:${req.sessionData.userId}`, JSON.stringify(req.sessionData), 'EX', 60 * 60 * 24);
  }

  next();
});
app.use((req, res, next) => {
  console.log("Session middleware executed successfully");
  redisClient.set('testKey', 'testValue', (err) => {
    if (err) console.error('Redis SET error:', err);
    else console.log('Redis SET success');
  });
  next();
});

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
const globalErrorHandler = require('./middlewares/globalErrorHandler');
const apiErrorHandler = require('./middlewares/apiErrorHandler');
const { checkAuthentication } = require('./middlewares/auth');
// const { createError } = require('./controllers/userController');
// const db = require('./model');

app.use('/' , authRoutes)

app.use("/log",(req,res)=>{
  console.log(req.user,"cokieeee");
  return res.status(200).json({ msg: 'Login successful authenticated' });
})

app.use('/api/v1/users', userRoutes);
// app.use('/api/v1/error',apiErrorHandler, createError);



// app.use(globalErrorHandler)
// router.use(apiErrorHandler);




app.listen(PORT, () => {
  console.log(`Service running on port ${PORT}`);
});
