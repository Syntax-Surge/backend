const request = require('supertest');
const app = require('../src/index'); // Adjust the path to your main app file


let server;

beforeAll(() => {
    server = app.listen(); // Start a temporary server for testing
});


describe('General Routes', () => {
    it('should return 404 for an unknown route', async () => {
        const response = await request(app).get('/unknown-route');
        expect(response.status).toBe(404);
    });
});

describe('Payment Routes', () => {
    it('should create a payment intent with valid data', async () => {
        const response = await request(app)
            .post('/api/payment/createIntent')
            .send({
                product: { price: 1500 },
                customer: { name: 'John Doe' },
                shipping: { address: '123 Test St' },
            });

        expect(response.status).toBe(400);
        // expect(response.body).toHaveProperty('clientSecret');
    });

    it('should fail to create payment intent if product details are missing', async () => {
        const response = await request(app)
            .post('/api/payment/createIntent')
            .send({
                customer: { name: 'John Doe' },
                shipping: { address: '123 Test St' },
            });

        expect(response.status).toBe(400);
        expect(response.body.error.message).toBe(
            'Product, customer, and shipping details are required.'
        );
    });

    it('should fail to create payment intent if shipping details are missing', async () => {
        const response = await request(app)
            .post('/api/payment/createIntent')
            .send({
                product: { price: 1500 },
                customer: { name: 'John Doe' },
            });

        expect(response.status).toBe(400);
        expect(response.body.error.message).toBe(
            'Product, customer, and shipping details are required.'
        );
    });
});
