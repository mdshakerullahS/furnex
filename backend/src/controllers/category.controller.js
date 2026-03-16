import cloudinary from "../config/cloudinary.js";
import Category from "../models/category.model.js";

export const addCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const existingCategory = await Category.findOne({
      name: name.trim(),
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists",
      });
    }

    const imageURL = req.file?.path || null;
    const cloudinaryID = req.file?.filename || null;

    await Category.create({ name, imageURL, cloudinaryID });

    return res.status(201).json({
      message: "Category added successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (_, res, next) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      categories,
    });
  } catch (err) {
    next(err);
  }
};

export const editCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const { name } = req.body;

    category.name = name || category.name;

    category.imageURL = req.file?.path || category.imageURL;
    category.cloudinaryID = req.file?.filename || category.cloudinaryID;

    await category.save();

    return res.status(200).json({
      message: "Category updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    if (category.cloudinaryID)
      await cloudinary.uploader.destroy(category.cloudinaryID);

    await category.deleteOne();

    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
