const request = require('supertest');
const session = require('express-session');
// const app = require('../index'); // Adjust the path to your server file
const app = require('../src/index')
// const { connectDB } = require('../config/db');
const { connectDB } = require('../src/config/db');

describe('Server Tests', () => {
    // 1. Server Initialization
    it('should run the server on the specified port', (done) => {
        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => {
            expect(app).toBeDefined();
            done();
        });
    });

    // 2. CORS Middleware
    it('should include CORS headers in the response', async () => {
        const response = await request(app).get('/');
        expect(response.headers['access-control-allow-origin']).toBe('*');
    });

    // 3. Session Configuration
    it('should set session cookies with proper attributes', () => {
        const options = session({
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: false,
                maxAge: 1000 * 60,
            },
        }).cookie;

        expect(options.secure).toBe(false);
        expect(options.maxAge).toBe(1000 * 60);
    });

    // 4. Route Configuration
    describe('Route Configuration', () => {
        it('should respond to /api/v1/users', async () => {
            const response = await request(app).get('/api/v1/users');
            // Adjust the expected status code and response logic if necessary
            expect(response.status).toBe(200);
        });

        it('should respond to the root route /', async () => {
            const response = await request(app).get('/');
            // Adjust the expected status code and response logic if necessary
            expect(response.status).toBe(200);
        });
    });

    // 5. Database Connection
    it('should connect to the database successfully', async () => {
        const result = await connectDB();
        expect(result).toBeDefined(); // Or any condition to confirm connection success
    });

    // 6. Error Handling Middleware
    describe('Error Handling Middleware', () => {
        it('should handle API errors correctly', async () => {
            const response = await request(app).get('/invalid-route');
            expect(response.status).toBe(404); // Adjust based on your middleware logic
        });

        it('should handle global errors correctly', async () => {
            const response = await request(app).get('/api/v1/users/getAllUsers'); // Simulate error
            expect(response.status).toBe(500); // Adjust based on middleware
        });
    });
});
