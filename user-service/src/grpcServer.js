const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const { User } = require('./config/db');
const { connectDB } = require('./config/db');

// Load the proto file
const PROTO_PATH = path.join(__dirname, 'grpc/user.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const userProto = grpc.loadPackageDefinition(packageDefinition).user;

connectDB();

// Define the gRPC methods
const getUserById = async (call, callback) => {
    try {
        const userId = call.request.id; 
        console.log('userId is', userId);

        const user = await User.findOne({ where: { id: userId } });

        if (user) {
            // Map Sequelize model to gRPC UserResponse
            const userResponse = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName || '',
                email: user.email,
                contactNo: user.contactNo,
                profileImage: user.profileImage || '',
                createdAt: user.createdAt.toISOString(), // Format createdAt
            };
            callback(null, userResponse);

        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: 'User not found',
            });
        }
    } catch (error) {
        console.error('Error in getUserById:', error);
        callback({
            code: grpc.status.INTERNAL,
            details: 'Internal server error',
        });
    }
};


// Create and start the gRPC server
const server = new grpc.Server();
server.addService(userProto.UserService.service, { GetUserById: getUserById });

const GRPC_PORT = process.env.GRPC_PORT || 50051;
server.bindAsync(`0.0.0.0:${GRPC_PORT}`, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`gRPC server running at ${GRPC_PORT}`);
});
