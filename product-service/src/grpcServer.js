const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const { Product } = require('./config/db');
const { connectDB , sequelize } = require('./config/db');

// Load the proto file
const PROTO_PATH = path.join(__dirname, '../proto/product.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const productProto = grpc.loadPackageDefinition(packageDefinition).product;

connectDB();

// Implement the GetProductById method
function getProductById(call, callback) {
    const productId = call.request.id;
    console.log('product is', userId);
    const product = Product.findOne({ where: { id: productId } });

    if (product) {
        // Map Sequelize model to gRPC UserResponse
        const productResponse = {
            id: product.id,
            productName: product.productName,
            productDescription: product.productDescription || '',
            pictureLocation: product.pictureLocation,
            unitWeight: product.unitWeight,
            unitPrice: product.unitPrice,
            availableQuantity: product.availableQuantity, 
        };
        callback(null, productResponse);
    } else {
        callback({
            code: grpc.status.NOT_FOUND,
            message: 'Product not found',
        });
    }
}

// Create and start the gRPC server
const server = new grpc.Server();
server.addService(productProto.ProductService.service, { GetProductById: getProductById });

const PORT = 50052; // gRPC server for Product microservice
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`Product gRPC server running at :${PORT}`);
    server.start();
});
