import mongoose from "mongoose";

const Schema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: false,
    default: 0,
  },
  quantity: {
    type: Number,
    required: false,
    default: 0,
  },
  category: {
    type: String,
    required: false,
    default: "Uncategorized",
  },
});

const Product = mongoose.model("products", Schema);

export default Product;
