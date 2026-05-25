import Promotion from "../models/promotion.model.js";

export const createPromotion = async (req, res, next) => {
  try {
    const {
      title,
      description,
      type,
      code,
      discountType,
      discountValue,
      targetScope,
      targetValue,
      startDate,
      endDate,
      isActive,
    } = req.body;

    if (!title || !discountValue || !startDate || !endDate) {
      return res.status(400).json({
        message: "Missing required promotion fields.",
      });
    }

    if (type === "promo_code" && !code) {
      return res.status(400).json({
        message: "Code is required for promo_code type.",
      });
    }

    const promotion = await Promotion.create({
      title,
      description,
      type,
      code,
      discountType,
      discountValue,
      targetScope,
      targetValue,
      startDate,
      endDate,
      isActive,
    });

    return res.status(201).json({
      message: "Promotion created successfully",
      promotion,
    });
  } catch (err) {
    next(err);
  }
};

export const getPromotions = async (req, res, next) => {
  try {
    const promotions = await Promotion.find().sort({ createdAt: -1 });
    return res.status(200).json({ promotions });
  } catch (err) {
    next(err);
  }
};

export const togglePromotion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const promotion = await Promotion.findByIdAndUpdate(
      id,
      { isActive },
      { new: true, runValidators: true },
    );

    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    return res.status(200).json({
      message: "Promotion status updated successfully",
      promotion,
    });
  } catch (err) {
    next(err);
  }
};

export const deletePromotion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedPromotion = await Promotion.findByIdAndDelete(id);

    if (!deletedPromotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    return res.status(200).json({
      message: "Promotion deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
