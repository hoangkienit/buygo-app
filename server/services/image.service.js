const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');
const fs = require('fs'); // Use standard fs for existsSync
const fsp = require('fs').promises; // Use fs.promises for async functions
const path = require('path'); // ✅ Import path để xử lý đường dẫn

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class ImageService {
  async processAndUploadImage(file, entityType, oldImageUrl) {
    try {
      if (!file || !file.path) {
        throw new Error("Không tìm thấy file để upload!");
      }

      // ✅ Kiểm tra định dạng file
      const allowedFormats = ['jpg', 'jpeg', 'png', 'webp'];
      const fileExt = path.extname(file.originalname).toLowerCase().replace('.', '');
      if (!allowedFormats.includes(fileExt)) {
        throw new Error('Chỉ hỗ trợ upload ảnh định dạng JPG, PNG, WEBP!');
      }

      // ✅ Xác định thư mục lưu ảnh
      let folder = entityType === 'avatar' ? 'app/avatars' : 'app/products';
      let imageSize = entityType === 'avatar' ? { width: 300, height: 300 } : { width: 600, height: 600 };

      // ✅ Resize & chuyển ảnh sang WebP
      const processedImageBuffer = await sharp(file.path)
        .resize(imageSize.width, imageSize.height, { fit: 'cover' })
        .toFormat('webp', { quality: 80 }) 
        .toBuffer();

      // ✅ Lấy public_id từ ảnh cũ (nếu có)
      let publicId = null;
      if (oldImageUrl) {
        const matches = oldImageUrl.match(/\/v\d+\/([^/]+)\.webp$/);
        if (matches) {
          publicId = `${folder}/${matches[1]}`;
        }
      }

      // ✅ Upload ảnh lên Cloudinary
      const cloudinaryResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder,
            public_id: `img_${Date.now()}`,
            format: 'webp',
            transformation: [{ quality: 'auto' }],
          },
          (error, result) => {
            if (error) return reject(new Error(error.message));
            if (!result || !result.secure_url) return reject(new Error('Upload thất bại!'));
            resolve(result);
          }
        );

        uploadStream.end(processedImageBuffer);
      });

      // ✅ Xóa ảnh cũ trên Cloudinary nếu có
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }

      setTimeout(async () => {
  try {
    if (fs.existsSync(file.path)) { // ✅ Use fs.existsSync properly
      await fsp.unlink(file.path); // ✅ Use fs.promises.unlink for async deletion
      console.log(`File deleted successfully: ${file.path}`);
    } else {
      console.log(`File not found, skipping deletion: ${file.path}`);
    }
  } catch (err) {
    console.error(`Error deleting file: ${err.message}`);
  }
}, 5000);


      return {
        message: 'Upload thành công!',
        imageUrl: cloudinaryResponse.secure_url,
      };
    } catch (error) {
      throw new Error('Lỗi xử lý ảnh: ' + error.message);
    }
  }
}

module.exports = new ImageService();
