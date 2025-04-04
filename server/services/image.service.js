const cloudinary = require('cloudinary').v2;
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
        throw new Error("File not found!");
      }

      // ✅ Kiểm tra định dạng file
      const allowedFormats = ['jpg', 'jpeg', 'png', 'webp'];
      const fileExt = path.extname(file.originalname).toLowerCase().replace('.', '');
      if (!allowedFormats.includes(fileExt)) {
        throw new Error('Only support type JPG, PNG, WEBP!');
      }

      // ✅ Xác định thư mục lưu ảnh
      let folder = entityType === 'avatar' ? 'app/avatars' : 'app/products';

      // ✅ Lấy public_id từ ảnh cũ (nếu có)
      let publicId = null;
      if (oldImageUrl) {
        const matches = oldImageUrl.match(/\/v\d+\/([^/]+)\.webp$/);
        if (matches) {
          publicId = `${folder}/${matches[1]}`;
        }
      }

      // ✅ Upload ảnh lên Cloudinary với tự động resize dựa trên kích thước gốc của ảnh
      const cloudinaryResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder,
            public_id: `product_${Date.now()}_${Math.random().toString(36).substring(7)}`, // Unique public_id
            format: 'webp',
            transformation: [
              { 
                quality: 'auto', // Automatic quality adjustment
                width: '600',   // Auto width based on original aspect ratio
                crop: 'scale'    // Limit the size of the image while maintaining aspect ratio
              }
            ],
          },
          (error, result) => {
            if (error) return reject(new Error(error.message));
            if (!result || !result.secure_url) return reject(new Error('Upload thất bại!'));
            resolve(result);
          }
        );

        fs.createReadStream(file.path).pipe(uploadStream); // Use fs.createReadStream to pipe the file
      });

      // ✅ Xóa ảnh cũ trên Cloudinary nếu có
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }

      // ✅ Xóa file tạm sau khi upload
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

  async deleteFromCloudinary(imageUrl) {
    try {
      if (!imageUrl) throw new Error('Image URL is required');
      
      const matches = imageUrl.match(/\/v\d+\/(.+)\.\w+$/);
      if (!matches) throw new Error('Invalid Cloudinary image URL');
      
      const publicId = matches[1];
      const response = await cloudinary.uploader.destroy(publicId);
      
      if (response.result !== 'ok') throw new Error('Failed to delete image from Cloudinary');
      
      console.log(`Deleted image from Cloudinary: ${publicId}`);
      return { success: true };
    } catch (error) {
      console.log(error.message);
      throw new Error(`Error deleting image from Cloudinary: ${error.message}`);
    }
  }
}

module.exports = new ImageService();
