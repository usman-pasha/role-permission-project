import mongoose, { Schema } from "mongoose";
const schema = Schema;

const permissionSchema = new schema(
  {
    permissionName: { type: String, required: true },
    isDefault: { type: Number, default: 0 }, //0 -> not default 1->default
  },
  { timestamps: true }
);

export const permissionModel = mongoose.model("permission", permissionSchema);
