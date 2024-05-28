import * as logger from "../../utils/logs.js";
import AppError from "../../utils/appError.js";
import { routerPermissionModel } from "../../models/routerPermission.model.js";

export const addRoutePermission = async (body) => {
    logger.info("Creating the add route permission");
    if (!body.routerEndPoint || !body.role)
        throw new AppError(400, "Required Parameters");

    const payload = {
        routerEndPoint: body.routerEndPoint,
        role: body.role,
        permission: body.permission,
        permissionId: body.permissionId
    };
    const record = await routerPermissionModel.findOneAndUpdate(
        {
            routerEndPoint: body.routerEndPoint,
            role: body.role
        },
        payload,
        { new: true, upsert: true, setDefaultsOnInsert: true })
    return record;
};

export const getRoutes = async (body) => {
    logger.info("Get the Routes");
    const record = await routerPermissionModel.find({ routerEndPoint: body.routerEndPoint })
        .populate([{ path: "permissionId", select: ["id", "permissionName"] }])
    return record;
};
