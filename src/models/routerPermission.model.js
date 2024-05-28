import mongoose, { Schema } from "mongoose";
const schema = Schema;

const routerPermissionSchema = new schema(
    {
        routerEndPoint: { type: String, required: true },
        role: { type: Number, required: true },
        permission: { type: Array, required: true },
        permissionId: { type: schema.Types.ObjectId, ref: "permission" }
    },
    { timestamps: true }
);

export const routerPermissionModel = mongoose.model(
    "routerPermission",
    routerPermissionSchema
);
