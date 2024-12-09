const request = require('supertest');
const app = require('../src/index');
const db = require('../src/config/db');

describe('Category API endpoints Tests', () => {
    // GET /api/v1/categories/browse
    test('should return 200 and products under a specific category', async () => {
        const response = await request(app).get('/api/v1/categories/browse?id=1&limit=10&offset=0');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
    
    test('should return 400 if no category ID is provided', async () => {
        const response = await request(app).get('/api/v1/categories/browse?limit=10&offset=0');
        expect(response.status).toBe(400);
        // expect(response.body.message).toBe('Category ID is required');
    });
    
    test('should return 200 if no products are found for the category', async () => {
        const response = await request(app).get('/api/v1/categories/browse?id=9999&limit=10&offset=0');
        expect(response.status).toBe(200);
        // expect(response.body.message).toBe('No products found for this category');
    });
    // Cleanup and close the DB connection after all tests
    afterAll(async () => {
        await db.sequelize.close();
    });
})