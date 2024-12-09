const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load the proto file
const PROTO_PATH = path.join(__dirname, 'user.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const userProto = grpc.loadPackageDefinition(packageDefinition).user;

// Create a client instance
const client = new userProto.UserService(
    'localhost:50051', 
    grpc.credentials.createInsecure()
);

// gRPC call to get user by ID
const getUserById = (id) => {
    return new Promise((resolve, reject) => {
        client.GetUserById({ id }, (error, response) => {
            if (error) {
                console.error('Error fetching user by ID:', error.message);
                return reject(error);
            } else {
                resolve(response);
            }
        });
    });
};

module.exports = {
    getUserById,
};
