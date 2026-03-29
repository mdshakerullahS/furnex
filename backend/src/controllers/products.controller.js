import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import Order from "../models/order.model.js";
import cloudinary from "../config/cloudinary.js";

export const addProduct = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      features,
      price,
      discountPrice,
      stock,
    } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({
        message: "Title, price, and category are required",
      });
    }

    const imageURLs = req.files?.length
      ? req.files.map((file) => file.path)
      : [];
    const cloudinaryIDs = req.files?.length
      ? req.files.map((file) => file.filename)
      : [];

    const matchedCategory = await Category.findOne({ _id: category });

    if (!matchedCategory) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    matchedCategory.productCount += 1;

    await matchedCategory.save();

    await Product.create({
      title,
      description,
      categoryID: matchedCategory._id,
      features,
      price,
      discountPrice,
      stock,
      imageURLs,
      cloudinaryIDs,
    });

    return res.status(201).json({
      message: "Product added successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sortBy,
      currentPage = 1,
      limit = 12,
    } = req.query;

    const filter = {};
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }
    if (category) {
      const matchedCategory = await Category.findOne({ name: category });
      filter.categoryID = matchedCategory._id;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let sort = {};
    if (sortBy === "newest-first") sort = { createdAt: -1 };
    else if (sortBy === "price-low-high") sort = { price: 1 };
    else if (sortBy === "price-high-low") sort = { price: -1 };

    const skip = (currentPage - 1) * limit;

    const [products, totalProducts] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .select("-cloudinaryIDs"),
      Product.countDocuments(filter),
    ]);

    res.json({ products, totalProducts });
  } catch (err) {
    next(err);
  }
};

export const getBestSellers = async (_, res, next) => {
  try {
    const bestSellers =
      (await Order.aggregate([
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.productID",
            totalSold: { $sum: "$items.quantity" },
          },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: "$product" },
      ])) || [];

    return res.status(200).json({ bestSellers });
  } catch (err) {
    next(err);
  }
};

export const getSingleProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .select("-cloudinaryIDs")
      .populate("categoryID");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({ product });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const { title, description, category, price, discountPrice, stock } =
      req.body;

    const matchedCategory = await Category.findOne({ name: category.trim() });

    product.title = title || product.title;
    product.description = description || product.description;
    product.categoryID = matchedCategory?._id || product.categoryID;
    product.price = price || product.price;
    product.discountPrice = discountPrice || product.discountPrice;
    product.stock = stock || product.stock;

    product.imageURLs = req.files?.length
      ? req.files.map((file) => file.path)
      : product.imageURLs;
    product.cloudinaryIDs = req.files?.length
      ? req.files.map((file) => file.filename)
      : product.cloudinaryIDs;

    await product.save();

    return res.status(200).json({
      message: "Product updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    for (const id of product.cloudinaryIDs) {
      await cloudinary.uploader.destroy(id);
    }

    await product.deleteOne();

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
