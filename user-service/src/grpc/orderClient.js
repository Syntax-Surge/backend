const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load the proto file
const PROTO_PATH = path.join(__dirname, 'order.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const orderItemsProto = grpc.loadPackageDefinition(packageDefinition).orderItems;

// Create a client instance
const client = new orderItemsProto.UserService(
    'localhost:50057', 
    grpc.credentials.createInsecure()
);

// gRPC call to get user by ID
const getOrderItemsById = (id) => {
    return new Promise((resolve, reject) => {
        console.error("Id", id);
        client.GetOrderItemsById({ id }, (error, response) => {
            if (error) {
                console.error("Error");
                reject(error);
            } else {
                console.log(response);
                
                resolve(response);
            }
        });
    });
};

module.exports = {
    getOrderItemsById,
};
