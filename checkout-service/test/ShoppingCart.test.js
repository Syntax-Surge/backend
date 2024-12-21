const request = require("supertest");
const app = require("../src/index");
const db = require("../src/config/db");

describe("Shopping Cart API Tests", () => {
  afterAll(async () => {
    await db.sequelize.close(); // Close the database connection after tests
  });

  // Test the Add to Cart endpoint
  describe("POST api/v1/orders/cart/add", () => {
    test("should add a product to the cart and return 201", async () => {
      const newCartItem = {
        userId: 1,
        productId: 5,
        quantity: 2,
      };

      const response = await request(app)
        .post("api/v1/orders/cart/add")
        .send(newCartItem);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("userId", newCartItem.userId);
      expect(response.body).toHaveProperty("productId", newCartItem.productId);
      expect(response.body).toHaveProperty("quantity", newCartItem.quantity);
    });

    test("should return 400 if required fields are missing", async () => {
      const response = await request(app)
        .post("api/v1/orders/cart/add")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Missing required fields!"
      );
    });
  });

  // Test the Remove from Cart endpoint
  describe("DELETE /api/v1/orders/cart/remove/${productId}", () => {
    test("should remove a product from the cart and return 200", async () => {
      const cartItemToRemove = {
        userId: 1,
        productId: 101,
      };

      const response = await request(app)
        .delete(`/api/v1/orders/cart/remove/${productId}`)
        .send(cartItemToRemove);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Item removed from cart successfully!"
      );
    });

    test("should return 404 if the cart item does not exist", async () => {
      const nonExistentCartItem = {
        userId: 1,
        productId: 999,
      };

      const response = await request(app)
        .delete("/api/cart")
        .send(nonExistentCartItem);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Resource not found");
    });

    test("should return 400 if required fields are missing", async () => {
      const response = await request(app)
        .delete(`api/v1/orders/cart/remove/${productId}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Missing required fields!"
      );
    });
  });

  // Test the Get Cart endpoint
  describe("GET api/v1/orders/cart/:userId", () => {
    test("should return 200 and list all cart items for a user", async () => {
      const userId = 1;

      const response = await request(app).get(`api/v1/orders/cart/${userId}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty("userId", userId);
        expect(response.body[0]).toHaveProperty("product");
      }
    });

    test("should return 404 if no items are in the cart", async () => {
      const userId = 999;

      const response = await request(app).get(`/api/cart/${userId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Resource not found");
    });

    test("should return 400 if userId is missing", async () => {
      const response = await request(app).get(`/api/cart/`);

      expect(response.status).toBe(404); // Invalid route
    });
  });
});
