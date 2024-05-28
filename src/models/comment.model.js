import mongoose, { Schema } from "mongoose";
const schema = Schema;

const commentSchema = new schema(
  {
    userId: { type: schema.Types.ObjectId, ref: "user" },
    postId: { type: schema.Types.ObjectId, ref: "post" },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

export const commentModel = mongoose.model("comment", commentSchema);
