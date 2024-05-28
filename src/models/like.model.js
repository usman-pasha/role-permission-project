import mongoose, { Schema } from "mongoose";
const schema = Schema;

const likeSchema = new schema(
  {
    userId: { type: schema.Types.ObjectId, ref: "user" },
    postId: { type: schema.Types.ObjectId, ref: "post" },
  },
  { timestamps: true }
);

export const likeModel = mongoose.model("like", likeSchema);
