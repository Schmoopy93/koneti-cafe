import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Indexi za performanse
categorySchema.index({ name: 1 });

const Category = mongoose.model("Category", categorySchema);

export default Category;
