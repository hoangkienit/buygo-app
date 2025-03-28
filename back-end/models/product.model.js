 const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        product_name: { type: String, required: true },
        product_description: { type: String },
        product_type: { 
            type: String, 
            enum: ["topup_package", "game_account"], 
            required: true 
        },
        product_slug: { type: String, required: true },
        product_category: { type: String, required: true },
        product_category: {
          type: String,
          enum: ["active", "inactive"],
          default: "active"
        },
        product_attributes: { type: mongoose.Schema.Types.Mixed, required: true },

    },
    {
        timestamps: true
    }
);

const TopUpPackageSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  packages: [
    {
        img: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
    }
    ]
    },{
        timestamps: true
 });

const GameAccountSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  accounts: [
    {
      username: { type: String, required: true }, // Tên đăng nhập
      password: { type: String, required: true }, // Mật khẩu
      price: { type: Number, required: true }, // Giá tài khoản
      sold: { type: Boolean, default: false } // Đã bán hay chưa
    }
  ]
},
    {
        timestamps: true
});

const Product = mongoose.model("Product", ProductSchema);

// Product attributes
const GameAccount = mongoose.model("Account", GameAccountSchema);
const TopUpPackage = mongoose.model("TopUpPackage", TopUpPackageSchema);

module.exports = { Product , TopUpPackage, GameAccount};
