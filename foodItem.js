const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema({
  name: String,
  expirationDate: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
});

module.exports = mongoose.model("FoodItem", foodItemSchema);
