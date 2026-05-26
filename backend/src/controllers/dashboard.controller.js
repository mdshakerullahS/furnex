import Order from "../models/order.model.js";
import User from "../models/user.model.js";

export const getOverviewData = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const isAllTime = !startDate && !endDate;
    const currentPeriodEnd = endDate ? new Date(endDate) : new Date();
    currentPeriodEnd.setHours(23, 59, 59, 999);

    let currentPeriodStart;
    if (isAllTime) {
      const firstOrder = await Order.findOne().sort({ createdAt: 1 });
      // If there are no orders, just default to 30 days ago
      currentPeriodStart = firstOrder
        ? new Date(firstOrder.createdAt)
        : new Date(new Date().setDate(new Date().getDate() - 30));
    } else {
      currentPeriodStart = new Date(startDate);
    }

    const duration = currentPeriodEnd.getTime() - currentPeriodStart.getTime();

    const previousPeriodStart = new Date(
      currentPeriodStart.getTime() - duration,
    );
    const previousPeriodEnd = new Date(currentPeriodEnd.getTime() - duration);

    // Total Revenue
    const currentRevenueAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: currentPeriodStart, $lte: currentPeriodEnd },
          status: { $ne: "Canceled" },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const currentRevenue = currentRevenueAgg[0]?.total || 0;

    const lastRevenueAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousPeriodStart, $lte: previousPeriodEnd },
          status: { $ne: "Canceled" },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const lastRevenue = lastRevenueAgg[0]?.total || 0;

    let revenueChange = 0;
    if (lastRevenue > 0) {
      revenueChange = ((currentRevenue - lastRevenue) / lastRevenue) * 100;
    } else if (currentRevenue > 0) {
      revenueChange = 100;
    }

    // Orders
    const currentOrdersCount = await Order.countDocuments({
      createdAt: { $gte: currentPeriodStart, $lte: currentPeriodEnd },
    });
    const lastOrdersCount = await Order.countDocuments({
      createdAt: { $gte: previousPeriodStart, $lte: previousPeriodEnd },
    });

    let ordersChange = 0;
    if (lastOrdersCount > 0) {
      ordersChange =
        ((currentOrdersCount - lastOrdersCount) / lastOrdersCount) * 100;
    } else if (currentOrdersCount > 0) {
      ordersChange = 100;
    }

    // Customers (New Customers)
    const currentCustomersCount = await User.countDocuments({
      role: "customer",
      createdAt: { $gte: currentPeriodStart, $lte: currentPeriodEnd },
    });
    const lastCustomersCount = await User.countDocuments({
      role: "customer",
      createdAt: { $gte: previousPeriodStart, $lte: previousPeriodEnd },
    });

    let customersChange = 0;
    if (lastCustomersCount > 0) {
      customersChange =
        ((currentCustomersCount - lastCustomersCount) / lastCustomersCount) *
        100;
    } else if (currentCustomersCount > 0) {
      customersChange = 100;
    }

    // Conversion Rate
    let conversionRate = 0;
    if (currentCustomersCount > 0) {
      conversionRate = (currentOrdersCount / currentCustomersCount) * 100;
    } else if (currentOrdersCount > 0) {
      conversionRate = 100;
    }
    if (conversionRate > 100) conversionRate = 100;

    let lastConversionRate = 0;
    if (lastCustomersCount > 0) {
      lastConversionRate = (lastOrdersCount / lastCustomersCount) * 100;
    } else if (lastOrdersCount > 0) {
      lastConversionRate = 100;
    }
    if (lastConversionRate > 100) lastConversionRate = 100;

    const conversionChange = conversionRate - lastConversionRate;

    // Chart Data
    const chartDataAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: currentPeriodStart, $lte: currentPeriodEnd },
          status: { $ne: "Canceled" },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          sale: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const chartDataMap = new Map();
    chartDataAgg.forEach((item) => {
      chartDataMap.set(item._id, item.sale);
    });

    const chartData = [];
    const loopDate = new Date(currentPeriodStart);
    // Limit to max 365 days to prevent massive payloads if "All Time" is very long
    let maxDays = 365;
    while (loopDate <= currentPeriodEnd && maxDays > 0) {
      const dateString = loopDate.toISOString().split("T")[0];
      chartData.push({
        date: dateString,
        sale: chartDataMap.get(dateString) || 0,
      });
      loopDate.setDate(loopDate.getDate() + 1);
      maxDays--;
    }

    // Recent Orders
    const recentOrders = await Order.find({
      createdAt: { $gte: currentPeriodStart, $lte: currentPeriodEnd },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("customerID", "name email avatar");

    // Top Selling Products
    const topProductsAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: currentPeriodStart, $lte: currentPeriodEnd },
          status: { $ne: "Canceled" },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productID",
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 1,
          totalSold: 1,
          revenue: 1,
          name: "$product.name",
          image: { $arrayElemAt: ["$product.images", 0] },
          category: "$product.category",
        },
      },
    ]);

    res.status(200).json({
      kpis: [
        {
          label: "Revenue",
          value: currentRevenue,
          change: parseFloat(Math.abs(revenueChange).toFixed(1)),
          changeType: revenueChange >= 0 ? "Increase" : "Decrease",
          prefix: "$",
        },
        {
          label: "Orders",
          value: currentOrdersCount,
          change: parseFloat(Math.abs(ordersChange).toFixed(1)),
          changeType: ordersChange >= 0 ? "Increase" : "Decrease",
        },
        {
          label: "New Customers",
          value: currentCustomersCount,
          change: parseFloat(Math.abs(customersChange).toFixed(1)),
          changeType: customersChange >= 0 ? "Increase" : "Decrease",
        },
        {
          label: "Conversion Rate",
          value: parseFloat(conversionRate.toFixed(1)),
          change: parseFloat(Math.abs(conversionChange).toFixed(1)),
          changeType: conversionChange >= 0 ? "Increase" : "Decrease",
          suffix: "%",
        },
      ],
      chartData,
      recentOrders,
      topProducts: topProductsAgg,
    });
  } catch (error) {
    next(error);
  }
};
