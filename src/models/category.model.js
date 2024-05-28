import mongoose, { Schema } from "mongoose";
const schema = Schema;

const categorySchema = new schema(
  {
    categoryName: { type: String, required: true },
  },
  { timestamps: true }
);

export const categoryModel = mongoose.model("category", categorySchema);
