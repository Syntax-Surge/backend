const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { connectDB } = require('./config/db');

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); 


// Initialize DB Connection
connectDB();

// Other middlewares and routes setup here

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Service running on port ${PORT}`);
});
