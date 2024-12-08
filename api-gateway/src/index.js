const express = require('express');
require('dotenv').config();
const cors = require("cors");
const NodeCache = require('node-cache');
const { createProxyMiddleware } = require('http-proxy-middleware');
const helmet = require('helmet');
const logger = require('./logger');


const app = express();
const cache = new NodeCache({ stdTTL: 60 });

app.use(cors());
app.use(helmet());
app.disable("x-powered-by");

app.use((req, res, next) => {
    logger.info(`Request - Method: ${req.method}, URL: ${req.url}, IP: ${req.ip}`);
    res.on('finish', () => {
        logger.info(`Response - Status: ${res.statusCode}, Method: ${req.method}, URL: ${req.url}`);
    });
    next();
});

// app.use('/api/products', async (req, res, next) => {
//     console.log("chash on");
//     const cachedResponse = cache.get(req.url);
//     if (cachedResponse) {
//         console.log("chased");
        
//         return res.json(cachedResponse);
//     }
//     next();
// });


const PRODUCTS_SERVICE = 'http://localhost:3004';
const CHECKOUT_SERVICE = 'http://localhost:3003';
const PAYMENTS_SERVICE = 'http://localhost:8003';


// load balancing
// const productsServices = ['http://localhost:3004', 'http://localhost:3005', 'http://localhost:3006'];
// let currentServiceIndex = 0;

// // Load Balancer Function
// function getNextService() {
//     const service = productsServices[currentServiceIndex];
//     currentServiceIndex = (currentServiceIndex + 1) % productsServices.length;
//     return service;
// }

// app.use('/api/products', (req, res, next) => {
//     const target = getNextService();
//     createProxyMiddleware({ target, changeOrigin: true })(req, res, next);
// });

//rate limiting

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
});


app.use('/api/products',limiter, createProxyMiddleware({ target: PRODUCTS_SERVICE, changeOrigin: true }));
app.use('/api/checkouts',limiter, createProxyMiddleware({ target: CHECKOUT_SERVICE, changeOrigin: true }));
app.use('/api/payments',limiter, createProxyMiddleware({ target: PAYMENTS_SERVICE, changeOrigin: true }));



app.get('/', (req,res)=>{
  console.log("api gateway");
  res.status(200).json({"service":"api gateway"})
  
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(`Error in API Gateway: ${err.message} - ${err.stack}`);
    res.status(500).send('Internal Server Error');
});

app.listen(3002, () => {
    logger.info(`API Gateway running on port 3002`);

});

