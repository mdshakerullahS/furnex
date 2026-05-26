import Settings from "../models/settings.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();

    // If no settings document exists, create a default one
    if (!settings) {
      settings = await Settings.create({});
    }

    return res.status(200).json({
      settings,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const {
      storeName,
      storeEmail,
      storePhone,
      currency,
      address,
      stripePublicKey,
      stripeSecretKey,
      enableCod,
      lowStockThreshold,
      enableNotifications,
      currentPassword,
      newPassword,
    } = req.body;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }

    settings.storeName =
      storeName !== undefined ? storeName : settings.storeName;
    settings.storeEmail =
      storeEmail !== undefined ? storeEmail : settings.storeEmail;
    settings.storePhone =
      storePhone !== undefined ? storePhone : settings.storePhone;
    settings.currency = currency !== undefined ? currency : settings.currency;
    settings.address = address !== undefined ? address : settings.address;
    settings.stripePublicKey =
      stripePublicKey !== undefined
        ? stripePublicKey
        : settings.stripePublicKey;
    settings.stripeSecretKey =
      stripeSecretKey !== undefined
        ? stripeSecretKey
        : settings.stripeSecretKey;
    settings.enableCod =
      enableCod !== undefined ? enableCod : settings.enableCod;
    settings.lowStockThreshold =
      lowStockThreshold !== undefined
        ? lowStockThreshold
        : settings.lowStockThreshold;
    settings.enableNotifications =
      enableNotifications !== undefined
        ? enableNotifications
        : settings.enableNotifications;

    await settings.save();

    // Handle password update if provided
    if (currentPassword && newPassword) {
      const adminId = req.admin?.userId;
      if (!adminId) {
        return res
          .status(401)
          .json({ message: "Unauthorized to update password" });
      }

      const adminUser = await User.findById(adminId);
      if (!adminUser) {
        return res.status(404).json({ message: "Admin user not found" });
      }

      const isMatch = await bcrypt.compare(currentPassword, adminUser.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect current password" });
      }

      adminUser.password = await bcrypt.hash(newPassword, 10);
      await adminUser.save();
    }

    return res.status(200).json({
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    next(error);
  }
};
