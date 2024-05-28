import mongoose, { Schema } from "mongoose";
const schema = Schema;

const roleSchema = new schema(
  {
    roleName: { type: String, required: true },
    value: { type: Number, required: true },
  },
  { timestamps: true }
);

export const roleModel = mongoose.model("role", roleSchema);
