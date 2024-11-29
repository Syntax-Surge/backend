const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load the proto file
const PROTO_PATH = path.join(__dirname, 'product.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const productProto = grpc.loadPackageDefinition(packageDefinition).product;

// Create a gRPC client
const productClient = new productProto.ProductService(
    'localhost:50052', // Product microservice gRPC server address
    grpc.credentials.createInsecure()
);

// gRPC call to get product by ID
const getProductById = (productId) => {
    return new Promise((resolve, reject) => {
        productClient.GetProductById({ id: productId }, (err, response) => {
            if (err) {
                return reject(err);
            }
            resolve(response);
        });
    });
};

module.exports = {
    getProductById,
};
