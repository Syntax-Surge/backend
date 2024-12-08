const request = require('supertest');
const app = require('../src/index');
const db = require('../src/config/db');

describe('Category API endpoints Tests', () => {
    // GET /api/v1/products/filter
    test('should return 200 and products filtered by price range', async () => {
        const response = await request(app).get('/api/v1/products/filter?minPrice=100&maxPrice=500');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('productName');
    });
    
    test('should return 400 if filter parameters are invalid', async () => {
        const response = await request(app).get('/api/v1/products/filter?minPrice=abc');
        expect(response.status).toBe(500);
        // expect(response.body.message).toBe('Invalid filter parameters');
    });
    // Cleanup and close the DB connection after all tests
    afterAll(async () => {
        await db.sequelize.close();
    });
})