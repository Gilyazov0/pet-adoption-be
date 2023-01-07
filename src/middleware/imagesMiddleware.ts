import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import Cloudinary from "cloudinary";
const cloudinary = Cloudinary.v2;

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
});

const upload = multer({ storage: storage });

export default upload;
