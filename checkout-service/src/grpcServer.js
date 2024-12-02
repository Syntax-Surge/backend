const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const { User } = require('./config/db');
const { connectDB } = require('./config/db');
const db = require('./config/db');
const OrderItems = db.orderItems;
const orders = db.orders;
const payments = db.payments;

// Load the proto file
const PROTO_PATH = path.join(__dirname, 'grpc/order.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const orderItemsProto = grpc.loadPackageDefinition(packageDefinition).orderItems;

connectDB();

// Define the gRPC methods
const getOrderItemsById = async (call, callback) => {
    try {
        const userId = call.request.id;
        // const userId = 2;
        console.log('userId is', userId);

        // const order = await OrderItems.findOne({ where: { id: userId } });
        // const order = await OrderItems.findOne({ where: { id: userId } });

        const order = await OrderItems.findAll({
            attributes: ['orderId', 'productId', 'quantity', 'id'],

            // where : {orderId: userId}
            include: [{ model: orders, where: { userId: userId } }]
        })

        const order1 = await orders.findAll({
            where: { userId: userId },
            attributes: ['userId'],
            include: [
                {
                    model: OrderItems,
                    as: 'items', // Alias defined in the association
                    attributes: ['orderId', 'productId', 'quantity']
                },
                {
                    model: payments,
                    as: 'payment', // Alias defined in the association
                    attributes: ['amount']
                }
            ]
        });

        const orderDataValues = order1.map(order => order.dataValues);


        
        
        console.log("------");
        // orderDataValues.forEach(order => {
        //     console.log(`User ID: ${order.userId}`);
        //     console.log(`Payment: ${order.payment}`);
        //     console.log('Items:');
        //     order.items.forEach(item => console.log(item.dataValues)); // Access the inner dataValues of each OrderItem
        // });
        // console.log(orderDataValues);
        // console.log(order1);
        console.log("------");
        
        




        const orderItemsData = order.map(item => item.dataValues);
        
        
        // console.log(orderItemsData);


        // if (orderItemsData) {
            if (orderDataValues) {
            // Map Sequelize model to gRPC UserResponse
            // const userResponse = {
            //     id: orderItemsData.id,
            //     orderId: orderItemsData.orderId,
            //     productId: orderItemsData.productId,
            //     quantity: orderItemsData.quantity,
            // };

            // Map through the array of order items
            const orderItems  = orderDataValues.map(item => ({
                id: item.id, // Assuming the 'id' is in each item
                orderId: item.orderId,
                productId: item.productId,
                quantity: item.quantity,
            }));



            const formattedData = orderDataValues.map(order => ({
                userId: parseInt(order.userId), // Convert to int if needed
                payment: order.payment ? parseFloat(order.payment.amount) : 5, // Ensure payment is a float or null
                items: order.items.map(item => ({
                    orderId: parseInt(item.dataValues.orderId),
                    productId: parseInt(item.dataValues.productId),
                    quantity: parseInt(item.dataValues.quantity)
                }))
            }));
            console.log(formattedData);
            formattedData.forEach(order => {
                console.log(`User ID: ${order.userId}`);
                console.log(`Payment: ${order.payment}`);
                console.log('Items:');
                order.items.forEach(item => console.log(item)); // Access the item directly
            });
            
            





            const userResponse = {
                // orderItems: orderItems,  // Wrap the mapped order items into the 'orderItems' field
                orderItems: formattedData,
            };
            // console.log(userResponse);


            callback(null, userResponse);

        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: 'User not found',
            });
        }
    } catch (error) {
        console.error('Error in getOrderItemsById:', error);
        callback({
            code: grpc.status.INTERNAL,
            details: 'Internal server error',
        });
    }
};


// Create and start the gRPC server
const server = new grpc.Server();
server.addService(orderItemsProto.UserService.service, { getOrderItemsById: getOrderItemsById });

const GRPC_PORT = process.env.GRPC_PORT || 50057;
server.bindAsync(`0.0.0.0:${GRPC_PORT}`, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`gRPC server running at ${GRPC_PORT}`);
});
