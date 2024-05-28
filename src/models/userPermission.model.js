import mongoose, { Schema } from "mongoose";
const schema = Schema;

const userPermissionSchema = new schema(
  {
    userId: { type: schema.Types.ObjectId, ref: "user" },
    permissions: [
      {
        permissionName: String,
        permissionValue: [Number], //0->create,1->read,2->edit,3->delete
      },
    ],
  },
  { timestamps: true }
);

export const userPermissionModel = mongoose.model(
  "userPermission",
  userPermissionSchema
);
