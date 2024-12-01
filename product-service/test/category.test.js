const request = require('supertest');
const app = require('../src/index');
const db = require('../src/config/db');

describe('Category API endpoints Tests', () => {
  //GET /api/v1/categories  
  test('should return 200 and an array of categories', async () => {
    const response = await request(app).get('/api/v1/categories');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('subcategories');
  });

  //GET /api/v1/subcategories
  test('should return 200 and a list of subcategories', async () => {
    const response = await request(app).get('/api/v1/categories/subCategories');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name');
  });

  //POST /api/v1/categories
  test('should return 201 and create a new category', async () => {
    const newCategory = {
      name: 'Bonsai 46',
      parentValue: 15,
      description: 'Bonsai items',
      image: '',
    };

    const response = await request(app)
      .post('/api/v1/categories')
      .send(newCategory);
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Bonsai 46');
  });

  test('should return 400 if required fields are missing', async () => {
    const response = await request(app)
      .post('/api/v1/categories')
      .send({});  // Missing required fields

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Missing required fields!');
  });

  test('should return 400 if category already exists', async () => {
    const existingCategory = {
        name: 'Bonsai 27',
        parentValue: 15,
        description: 'Bonsai items',
        image: '',
    };

    await request(app).post('/api/v1/categories').send(existingCategory); // Create the category first
    const response = await request(app)
      .post('/api/v1/categories')
      .send(existingCategory); // Attempt to create the same category again
    
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Category already exists.');
  });

  //PUT /api/v1/categories/:id
  test('should return 200 and update the category', async () => {
    // const newCategory = {
    //     name: 'Bonsai 55',
    //     parentValue: 14,
    //     description: 'Bonsai items',
    //     image: '',
    // };

    // // First, create a category to update
    // const categoryResponse = await request(app)
    //   .post('/api/v1/categories')
    //   .send(newCategory);
    // const categoryId = categoryResponse.body.id;

    // Now, update the category
    const updatedCategory = {
        name: 'Bonsai 55',
        parentValue: 15,
        description: 'Bonsai is items',
        image: '',
    };

    const updateResponse = await request(app)
      .put(`/api/v1/categories/15`)
      .send(updatedCategory);
    
    expect(updateResponse.status).toBe(200);
  });

  test('should return 404 if category not found', async () => {
    const response = await request(app)
      .put('/api/v1/categories/9999') // Non-existing category ID
      .send({ name: 'Non-existent Category' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Cannot find the Category 9999');
  });

  test('should return 400 if required fields are missing', async () => {
    const response = await request(app)
      .put('/api/v1/categories/12') // Assuming category with ID 12 exists
      .send({}); // Missing required fields

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Missing required fields!');
  });

  //DELETE /api/v1/categories/:id
  test('should return 200 and delete the category if no products are associated', async () => {
    const newCategory = {
        name: 'Bonsai 56',
        parentValue: 14,
        description: 'Bonsai items',
        image: '',
    };

    // First, create a category to delete
    const categoryResponse = await request(app)
      .post('/api/v1/categories')
      .send(newCategory);
    const categoryId = categoryResponse.body.id;

    // Delete the created category
    const deleteResponse = await request(app)
      .delete(`/api/v1/categories/${categoryId}`);
    
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toEqual(1); // 1 row deleted
  });

  test('should return 400 if category has associated products', async () => {
    // Create a category with associated products first
    // const categoryWithProducts = {
    //     name: 'Bonsai 28',
    //     parentValue: 14,
    //     description: 'Bonsai items',
    //     image: '',
    // };

    // const categoryResponse = await request(app)
    //   .post('/api/v1/categories')
    //   .send(categoryWithProducts);
    // const categoryId = categoryResponse.body.id;

    const deleteResponse = await request(app)
      .delete(`/api/v1/categories/12`);
    
    expect(deleteResponse.status).toBe(400);
    expect(deleteResponse.body.message).toContain('Cannot delete the category.');
  });

  test('should return 404 if category not found', async () => {
    const response = await request(app)
      .delete('/api/v1/categories/9999'); // Non-existing category ID
    
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Cannot find the Category 9999');
  });

    // Close DB connection after all tests
    afterAll(async () => {
        await db.sequelize.close();
    });
});
