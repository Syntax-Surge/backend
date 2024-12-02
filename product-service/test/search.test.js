const request = require('supertest');
const app = require('../src/index');
const db = require('../src/config/db');

describe('Search API endpoint tests', () => {
    // GET /api/v1/products/search
    test('should return 200 and products matching the search keyword', async () => {
        const response = await request(app).get('/api/v1/products/search?keyword=barrel');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('productName');
    });
    test('should return 400 if no keyword is provided for search', async () => {
        const response = await request(app).get('/api/v1/products/search');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Keyword is required for searching');
    });
    // Cleanup and close the DB connection after all tests
    afterAll(async () => {
        await db.sequelize.close();
    });
})