const InventorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, default: 1 },
      receivedAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("Inventory", InventorySchema);
