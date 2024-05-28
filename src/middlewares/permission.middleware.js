import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;
import { userModel } from "../models/user.model.js";
import { routerPermissionModel } from "../models/routerPermission.model.js";

export const userPermissions = async (userId) => {
    const record = await userModel.aggregate([
        {
            $match: { _id: new ObjectId(userId) },
        },
        {
            $lookup: {
                from: "userpermissions",
                localField: "_id",
                foreignField: "userId",
                as: "permissions",
            },
        },
        {
            $project: {
                _id: 1,
                username: 1,
                email: 1,
                phoneNumber: 1,
                role: 1,
                permissions: {
                    $cond: {
                        if: { $isArray: "$permissions" },
                        then: { $arrayElemAt: ["$permissions", 0] },
                        else: null,
                    },
                },
            },
        },
        {
            $addFields: {
                permissions: {
                    permissions: {
                        $map: {
                            input: "$permissions.permissions",
                            as: "permission",
                            in: {
                                permissionName: "$$permission.permissionName",
                                permissionValue: "$$permission.permissionValue",
                            },
                        },
                    },
                },
            },
        },
        {
            $project: {
                "permissions.userId": 0,
                "permissions.__v": 0,
                "permissions.createdAt": 0,
                "permissions.updatedAt": 0,
            },
        },
    ]);

    return record[0]
}

// check router permission
export const getRouterPermission = async (router, role) => {
    const routerPermission = await routerPermissionModel.findOne({
        routerEndPoint: router,
        role: role
    }).populate([{ path: "permissionId", select: ["id permissionName"] }])
    return routerPermission
}
