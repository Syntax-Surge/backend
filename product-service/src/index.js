const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { connectDB } = require('./config/db');
const db = require('./config/db');
const categoryRoutes = require('./routes/categoryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const filterRoutes = require('./routes/filterRoutes');
const productOpRoutes = require('./routes/productOp routes/productOp.route');
const searchRoutes = require('./routes/serch');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// console.log('Line 15 called');

// Initialize DB Connection

db.sequelize.sync().then(function () {
  console.log('Database Connected');
});

app.get('/', (req, res) => {
  console.log('product');
  res.status(200).json({ service: 'product' });
});
// Other middlewares and routes setup here

app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productOpRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/filter', filterRoutes);
app.use('/api/v1/search', searchRoutes);

const PORT = process.env.PORT || 3004;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Service running on port ${PORT}`);
  });
}

module.exports = app;
