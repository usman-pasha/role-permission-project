import AppError from "../utils/appError.js";
import catchError from "../utils/catchError.js"
import { getRouterPermission, userPermissions } from "./permission.middleware.js";

export const checkPermission = catchError(async (req, res, next) => {
    if (req.user.role !== 1) {
        // if user not admin
        const routerPermission = await getRouterPermission(req.path, req.user.role);
        const userPermission = await userPermissions(req.userId);
        if (userPermission.permissions.permissions == undefined || !routerPermission)
            throw new AppError(400, "You haven't permission to access this routes")

        const permissionName = routerPermission.permissionId.permissionName
        const permissionValue = routerPermission.permission //[0]

        const hasPermission = userPermission.permissions.permissions.some(permission =>
            permission.permissionName == permissionName &&
            permission.permissionValue.some(value => permissionValue.includes(value))
        )
        if (!hasPermission)
            throw new AppError(400, "You haven't permission to access this routes")
    }
    return next()
})