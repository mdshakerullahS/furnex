import cloudinary from "../config/cloudinary.js";
import CloudinaryStorage from "multer-storage-cloudinary";
import multer from "multer";

const categoryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: `${
      process.env.NODE_ENV === "production" ? "eCom" : "localECom"
    }/categories`,
    public_id: (_, file) =>
      `${Date.now()}_${file.originalname
        .split(".")[0]
        .replace(/\s+/g, "-")
        .toLowerCase()}`,
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  },
});

const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: `${
      process.env.NODE_ENV === "production" ? "eCom" : "localECom"
    }/products`,
    public_id: (_, file) =>
      `${Date.now()}_${file.originalname
        .split(".")[0]
        .replace(/\s+/g, "-")
        .toLowerCase()}`,
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  },
});

export const uploadCategoryImage = multer({ storage: categoryStorage });
export const uploadProductImage = multer({ storage: productStorage });
