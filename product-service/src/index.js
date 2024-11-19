const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { connectDB } = require('./config/db');
const db = require('./config/db');
const uploadRoutes = require('./routes/uploadRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); 

console.log("Line 15 called");
// Initialize DB Connection
db.sequelize.sync().then(function(){
  console.log("Database Connected");
})

// Other middlewares and routes setup here
app.use('/api/v1/categories', uploadRoutes);
app.use('/api/v1/categories', categoryRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Service running on port ${PORT}`);
});
