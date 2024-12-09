const asyncHandler = require("express-async-handler")
const db  = require("../config/db")

const Orders = db.orders;
const OrderItems = db.orderItems;

const getAllOrders = asyncHandler(async (req, res) => {
        const page = req.query.page;
        const limit = 8;
        console.log("get all orders",page,limit);
        let offset = limit * (page - 1)
        try {
            const orders = await Orders.findAndCountAll({
                limit: limit,
                offset: offset,
                order: [['createdAt', 'DESC']],
                include: [
                    { 
                        model: OrderItems,
                        as: 'items'
                    }
                ]         
            })
            res.status(200).json(orders);
        } catch (error) {
            res.status(400);
            throw new Error(error.message || "Can't get orders");
        }
    });

// const getOrderItemsByUserId = asyncHandler(async (req, res) => {
//     const userId = req.params.id;
//     const page = req.query.page;
//     const limit = 8;
//     console.log("get items by user id",page,limit);
//     let offset = limit * (page - 1)
//     try {
//         const orderItems = await Orders.findAndCountAll({
//             limit: limit,
//             offset: offset,
//             order: [['createdAt', 'DESC']],
//             where: {userId: userId},
//             include: [
//                 { 
//                     model: OrderItems,
//                     as: 'items'
//                 }
//             ]      
//         })
//         // Flatten the items from all orders
//         const items = orderItems.rows.reduce((acc, order) => {
//             return acc.concat(order.items);
//         }, []);

//         res.status(200).json({ items });
//     } catch (error) {
//         res.status(400);
//         throw new Error(error.message || "Can't get items by user id");
//     }
// });

const getOrderByOrderId = asyncHandler(async (req, res) => {
    const orderId = req.query.id;
    const page = req.query.page;
    const limit = 8;
    console.log("get orders by order id", orderId);
    let offset = limit * (page - 1)
    try {
        const orderDetails = await Orders.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']],
            where: { id: orderId},     
        })

        res.status(200).json(orderDetails);
    } catch (error) {
        res.status(400);
        throw new Error(error.message || "Can't get items by user id");
    }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId, status } = req.body;
  
    if (!orderId || !status) {
      res.status(400);
      throw new Error("Order ID and status are required");
    }
  
    try {
      const order = await Orders.findByPk(orderId);
  
      if (!order) {
        res.status(404);
        throw new Error("Order not found");
      }
  
      // Update the order status
      order.status = status;
      await order.save();
  
      res.status(200).json({
        message: "Order status updated successfully",
        updatedOrder: order,
      });
    } catch (error) {
      res.status(500);
      throw new Error(error.message || "Failed to update order status");
    }
  });
  

module.exports = {getAllOrders,  getOrderByOrderId, updateOrderStatus};