import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

// @desc    Get sales report
// @route   GET /api/reports/sales
// @access  Private/Admin
const getSalesReport = asyncHandler(async (req, res) => {
  const { start, end } = req.query;
  const matchObj = { isPaid: true, excludeFromStats: { $ne: true }, isCancelled: { $ne: true } };
  const allMatchObj = { excludeFromStats: { $ne: true } };
  
  if (start && end) {
    const startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);
    matchObj.paidAt = { $gte: startDate, $lte: endDate };
    allMatchObj.createdAt = { $gte: startDate, $lte: endDate };
  }

  const sales = await Order.aggregate([
    { $match: matchObj },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
        totalSales: { $sum: "$totalPrice" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Optionally filter top products based on recent orders if we wanted strictly date bound product data 
  // but to keep it simple and accurate for overall, we'll keep it total.
  const topProducts = await Product.find({}).sort({ soldCount: -1 }).limit(5).select('name soldCount price image');

  const totalRevenue = sales.reduce((acc, curr) => acc + curr.totalSales, 0);

  const categorySales = await Order.aggregate([
    { $match: matchObj },
    { $unwind: "$orderItems" },
    {
      $lookup: {
        from: "products",
        localField: "orderItems.product",
        foreignField: "_id",
        as: "productDetails"
      }
    },
    { $unwind: "$productDetails" },
    {
      $group: {
        _id: "$productDetails.category",
        totalSales: { $sum: { $multiply: ["$orderItems.qty", "$orderItems.price"] } },
        unitsSold: { $sum: "$orderItems.qty" }
      }
    }
  ]);

  const orderStatus = await Order.aggregate([
    { $match: allMatchObj },
    {
      $group: {
        _id: { $cond: [{ $eq: ["$isDelivered", true] }, "Delivered", { $cond: [{ $eq: ["$isShipped", true] }, "Shipped", { $cond: [{ $eq: ["$isCancelled", true] }, "Cancelled", "Pending"] }] }] },
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({ sales, topProducts, totalRevenue, categorySales, orderStatus });
});

// @desc    Get inventory report
// @route   GET /api/reports/inventory
// @access  Private/Admin
const getInventoryReport = asyncHandler(async (req, res) => {
  const totalProducts = await Product.countDocuments({});
  const outOfStock = await Product.countDocuments({ countInStock: 0 });
  const lowStock = await Product.countDocuments({ countInStock: { $lt: 5, $gt: 0 } });
  
  const categoryDistribution = await Product.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        stock: { $sum: "$countInStock" }
      }
    }
  ]);

  res.json({ totalProducts, outOfStock, lowStock, categoryDistribution });
});

// @desc    Get user report
// @route   GET /api/reports/users
// @access  Private/Admin
const getUserReport = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({});
  const activeUsers = await Order.distinct('user', { isPaid: true, excludeFromStats: { $ne: true }, isCancelled: { $ne: true } });
  
  const userStats = await User.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    { $limit: 30 }
  ]);

  const recentUsers = await User.find({}).sort({ createdAt: -1 }).limit(5).select('name email createdAt');

  res.json({ totalUsers, activeUsersCount: activeUsers.length, userStats, recentUsers });
});

export { getSalesReport, getInventoryReport, getUserReport };
