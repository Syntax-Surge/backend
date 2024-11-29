const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const { Product } = require("./config/db");
const { connectDB } = require("./config/db");

// Load the proto file
const PROTO_PATH = path.join(__dirname, "grpc/product.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const productProto = grpc.loadPackageDefinition(packageDefinition).product;

// connectDB();

// Implement the GetProductById method
const getProductById = async (call, callback) => {
  const productId = call.request.id;
  console.log("product is", productId);
  const product = await Product.findOne({ where: { id: productId } });

  console.log("product is -", product);

  if (product) {
    // Map Sequelize model to gRPC UserResponse
    const productResponse = {
      id: product.id,
      productName: product.productName,
      productDescription: product.productDescription || "",
      pictureLocation: product.pictureLocation,
      unitWeight: product.unitWeight,
      unitPrice: product.unitPrice,
      availableQuantity: product.availableQuantity,
    };

    console.log("response ", productResponse);
    callback(null, productResponse);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      message: "Product not found",
    });
  }
};

const getProductsByIds = async (call, callback) => {
  const productIds = call.request.ids; // Array of product IDs from request
  console.log("Fetching products with IDs:", productIds);

  await Product.findAll({
    where: { id: productIds }, // Sequelize batch fetch
  })
    .then((products) => {
      if (products.length === 0) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: "No products found",
        });
      }

      // Map Sequelize models to gRPC ProductResponse objects
      const productResponses = products.map((product) => ({
        id: product.id,
        productName: product.productName,
        productDescription: product.productDescription || "",
        pictureLocation: product.pictureLocation,
        unitWeight: product.unitWeight,
        unitPrice: product.unitPrice,
        availableQuantity: product.availableQuantity,
      }));

      callback(null, { products: productResponses });
    })
    .catch((error) => {
      console.error("Error fetching products:", error.message);
      callback({
        code: grpc.status.INTERNAL,
        message: "Error fetching products",
      });
    });
};

// Create and start the gRPC server
const server = new grpc.Server();
server.addService(productProto.ProductService.service, {
  GetProductById: getProductById,
  GetProductsByIds: getProductsByIds,
});

const PORT = 50052; // gRPC server for Product microservice
server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(`Product gRPC server running at :${PORT}`);
  }
);
