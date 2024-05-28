import mongoose, { Schema } from "mongoose";
const schema = Schema;

const postSchema = new schema(
  {
    title: { type: String, required: true },
    discription: { type: String, required: true },
    categories: [{ type: schema.Types.ObjectId, ref: "category" }],
  },
  { timestamps: true }
);

export const postModel = mongoose.model("post", postSchema);
