const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const { User } = require('./config/db');
const { connectDB } = require('./config/db');
const db = require('./config/db');
const { getProductById } = require('./grpc/productClient');
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
        console.log('userId is', userId);

        const order = await OrderItems.findAll({
            attributes: ['orderId', 'productId', 'quantity', 'id'],

            // where : {orderId: userId}
            include: [{ model: orders, where: { userId: userId } }]
        })

        const order1 = await orders.findAll({
            where: { userId: userId },
            attributes: ['userId', 'shippingMethod', 'status'],
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
        })

        const orderDataValues = order1.map(order => order.dataValues);

        if (orderDataValues) {

            const formattedData = orderDataValues.map(order => ({
                userId: parseInt(order.userId), // Convert to int if needed
                shippingMethod: String(order.shippingMethod),
                status: String(order.status),
                payment: order.payment ? parseFloat(order.payment.amount) : 5, // Ensure payment is a float or null
                items: order.items.map(item => ({
                    orderId: parseInt(item.dataValues.orderId),
                    productId: parseInt(item.dataValues.productId),
                    quantity: parseInt(item.dataValues.quantity),

                }))
            }));
            console.log(formattedData);
            formattedData.forEach(order => {
                console.log(`User ID: ${order.userId}`);
                console.log(`shippingMethod: ${order.shippingMethod}`);
                console.log(`status: ${order.status}`);
                console.log(`Payment: ${order.payment}`);
                console.log('Items:');
                order.items.forEach(item => console.log(item)); // Access the item directly
            });

            // const userResponse = {
            //     orderItems: formattedData,
            // };

            const formattedDataNew = [];

            for (const order of formattedData) {
                const itemsWithDetails = [];

                for (const item of order.items) {
                    // console.log("product Id", item.productId);
                    const productDetails = await getProductById(item.productId);
                    console.log("productDetails", productDetails);



                    itemsWithDetails.push({
                        orderId: item.orderId,
                        productId: item.productId,
                        quantity: item.quantity,
                        ...productDetails, // Add product details
                    });
                }

                formattedDataNew.push({
                    userId: order.userId,
                    shippingMethod: order.shippingMethod,
                    status: order.status,
                    payment: order.payment,
                    items: itemsWithDetails,
                });
            }
            // console.log(formattedDataNew);
            // formattedDataNew.forEach(order => {
            //     console.log(`User ID: ${order.userId}`);
            //     console.log(`Payment: ${order.payment}`);
            //     console.log('Items:');
            //     order.items.forEach(item => console.log(item)); // Access the item directly
            // });

            const formattedResponseFinal2 = {
                orderItems: formattedDataNew.map(order => ({
                    userId: order.userId,
                    shippingMethod: order.shippingMethod,
                    status: order.status,
                    payment: order.payment,
                    items: order.items.map(item => ({
                        orderId: item.orderId,
                        productId: item.productId,
                        quantity: item.quantity,
                        id: item.id,
                        productName: item.productName,
                        productDescription: item.productDescription,
                        pictureLocation: item.pictureLocation,
                        unitWeight: item.unitWeight,
                        unitPrice: item.unitPrice,
                        availableQuantity: item.availableQuantity,
                    })),
                })),
            };




            const result = {};

            formattedDataNew.forEach(order => {
                result[order.userId] = {
                    payment: order.payment,
                    items: order.items,
                };
            });
            console.log("===================");
            console.log(result);
            // Object.entries(result).forEach(([userId, order]) => {
            //     console.log(`User ID: ${userId}`);
            //     console.log(`Payment: ${order.payment}`);
            //     console.log('Items:');

            //     order.items.forEach(item => {
            //         console.log('  Item Details:');
            //         Object.entries(item).forEach(([key, value]) => {
            //             console.log(`    ${key}: ${value}`);
            //         });
            //     });

            //     console.log('==========================');
            // });

            const formattedResponseFinal = {
                orderItems: Object.entries(result).map(([userId, order]) => ({
                    userId: parseInt(userId), // Ensure userId is an integer
                    payment: order.payment, // The payment amount
                    items: order.items.map(item => ({

                        orderId: item.orderId, // Order ID
                        productId: item.productId, // Product ID
                        quantity: item.quantity, // Quantity ordered
                        id: item.id, // Unique item ID
                        productName: item.productName, // Name of the product
                        productDescription: item.productDescription, // Product description
                        pictureLocation: item.pictureLocation, // Picture URL
                        unitWeight: item.unitWeight, // Weight of a single unit
                        unitPrice: item.unitPrice, // Price per unit
                        availableQuantity: item.availableQuantity, // Available stock
                    })),
                })),
            };

            //   formattedResponseFinal2.forEach(order => {
            //     console.log(`User ID: ${order.userId}`);
            //     console.log(`Payment: ${order.payment}`);
            //     console.log('Items:');
            //     order.items.forEach(item => console.log(item)); // Access the item directly
            // });


            // console.log('Formatted Response:', JSON.stringify(formattedResponseFinal, null, 2))


            callback(null, formattedResponseFinal2);

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
server.addService(orderItemsProto.UserService.service, { GetOrderItemsById: getOrderItemsById, GetAllOrderItems: getOrderItemsById, });

const GRPC_PORT = process.env.GRPC_PORT || 50053;
server.bindAsync(`0.0.0.0:${GRPC_PORT}`, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`gRPC server running at ${GRPC_PORT}`);
});
