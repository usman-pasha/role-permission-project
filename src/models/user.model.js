import mongoose, { Schema } from "mongoose";
const schema = Schema;

const userSchema = new schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: Number, required: true, unique: true },
    password: { type: String },
    role: { type: Number, default: 0 }, //0->Normal User,1->Admin,2->Sub-Admin,3->Editor
    createdBy: { type: String, default: "system" },
    updatedBy: { type: String, default: "system" },
  },
  { timestamps: true }
);

export const userModel = mongoose.model("user", userSchema);
