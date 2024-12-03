// const request = require('supertest');
// const app = require('../src/index');
// const db = require('../src/config/db');

// describe('Express App Tests', () => {
  
//   // Test the root endpoint
//   test('should return 200 and service details at /', async () => {
//     const response = await request(app).get('/');
//     expect(response.status).toBe(200);
//     expect(response.body).toEqual({ service: 'product' });
//   });

//   // Test categories endpoint
//   test('should return 200 and categories at /api/v1/categories', async () => {
//     const response = await request(app).get('/api/v1/categories');
//     expect(response.status).toBe(200);
//   });

//   // Test products endpoint
//   test('should return 200 and products at /api/v1/products', async () => {
//     const response = await request(app).get('/api/v1/products');
//     expect(response.status).toBe(200);
//   });

//   // Test reviews endpoint
//   test('should return 200 and reviews at /api/v1/reviews', async () => {
//     const response = await request(app).get('/api/v1/reviews');
//     expect(response.status).toBe(200);
//   });

//   // Test invalid endpoint
//   test('should return 404 for an unknown endpoint', async () => {
//     const response = await request(app).get('/api/v1/unknown');
//     expect(response.status).toBe(404);
//   });

//   // Close DB connection after all tests
//   afterAll(async () => {
//     await db.sequelize.close();
//   });
// });
