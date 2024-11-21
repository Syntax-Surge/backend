const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { connectDB } = require('./config/db');

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); 


// Initialize DB Connection
// connectDB();

app.get('/', (req,res)=>{
  console.log("product");
  res.status(200).json({"service":"product"})
  
});
// Other middlewares and routes setup here

const PORT = process.env.PORT;

app.listen(3004, () => {
  console.log(`Service running on port 3004`);
});
