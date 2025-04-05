const { required } = require("joi");
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, index: 1 },
    product_name: { type: String, required: true },
    product_description: { type: String, default: "" },
    product_type: {
      type: String,
      enum: ["topup_package", "game_account", "utility_account"],
      required: true,
    },
    product_slug: { type: String, required: true, index: 1 },
    product_category: { type: String, required: true },
    product_status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    product_stock: { type: Number, default: 0, required: true },
    product_imgs: [{ type: String, required: true }],
    product_sold_amount: {type: Number, default: 0},
    product_attributes: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

const TopUpPackageSchema = new mongoose.Schema(
  {
    packages: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        status: {
          type: String,
          enum: ['order', 'available'],
          default: 'available'
        }
      },
    ],
  },
  { timestamps: true }
);

const GameAccountSchema = new mongoose.Schema(
  {
    price: { type: Number, required: true },
    account: [
      {
        username: { type: String, required: true },
        password: { type: String, required: true },
        sold: {type: Boolean, default: false}
      }
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);
const GameAccount = mongoose.model("GameAccount", GameAccountSchema);
const TopUpPackage = mongoose.model("TopUpPackage", TopUpPackageSchema);

module.exports = { Product, TopUpPackage, GameAccount };
