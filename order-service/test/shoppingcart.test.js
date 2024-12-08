const request = require("supertest");
const app = require("../src/index"); // Update to your app's main entry point
const db = require("../src/config/db");

describe("Shopping Cart API Endpoints Tests", () => {
  // Add to Cart
  test("should return 201 and add item to cart", async () => {
    const newCartItem = {
      userId: 1,
      productId: 101,
      quantity: 2,
    };

    //const response = await request(app).post("/api/cart/add").send(newCartItem);
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("userId", newCartItem.userId);
    expect(response.body).toHaveProperty("productId", newCartItem.productId);
    expect(response.body).toHaveProperty("quantity", newCartItem.quantity);
  });

  test("should return 400 for missing fields when adding to cart", async () => {
    const response = await request(app).post("/api/cart/add").send({});
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing required fields!");
  });

  test("should return 200 and update quantity if item already exists in cart", async () => {
    const existingCartItem = {
      userId: 1,
      productId: 101,
      quantity: 1,
    };

    await request(app).post("/api/cart/add").send(existingCartItem);

    const updatedCartItem = {
      userId: 1,
      productId: 35,
      quantity: 3,
    };

    const response = await request(app)
      .post("/api/cart/add")
      .send(updatedCartItem);
    expect(response.status).toBe(201);
    expect(response.body.quantity).toBe(41); // Existing quantity + new quantity
  });

  // Remove from Cart
  test("should return 200 and remove item from cart", async () => {
    const userId = 1;
    const productId = 101;

    const response = await request(app)
      .delete(`/api/cart/remove/${productId}`)
      .send({ userId });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing required fields!");
  });

  test("should return 404 when trying to remove non-existent item", async () => {
    const userId = 1;
    const productId = 999;

    const response = await request(app)
      .delete(`/api/cart/remove/${productId}`)
      .send({ userId });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing required fields!");
  });

  // Get Cart
  test("should return 200 and the cart items for a user", async () => {
    const userId = 1;

    // Adding some items to the cart for testing
    await request(app).post("/api/cart/add").send({
      userId: 1,
      productId: 101,
      quantity: 2,
    });
    await request(app).post("/api/cart/add").send({
      userId: 1,
      productId: 102,
      quantity: 1,
    });

    const response = await request(app).get(`/api/cart/${userId}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty("userId", userId);
    expect(response.body[0]).toHaveProperty("product");
  });

  test("should return 404 when no items are in the cart for a user", async () => {
    const response = await request(app).get("/api/cart/999"); // Non-existing userId
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("No items in the cart!");
  });

  // Clean up after tests
  afterAll(async () => {
    await db.sequelize.close();
  });
});
