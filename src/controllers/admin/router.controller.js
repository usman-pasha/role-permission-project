import * as logger from "../../utils/logs.js";
import * as responser from "../../utils/responser.js";
import * as routesServices from "../../services/admin/routerPermission.service.js";

export const getAllRoutes = async (req, res) => {
    const routes = [];
    const stack = req.app._router.stack;

    stack.forEach((layer) => {
        if (layer.route) {
            // This layer is a route
            const { path, methods } = layer.route;
            routes.push({ path, methods });
        } else if (layer.name === 'router' && layer.handle.stack) {
            // This layer is a router containing other routes
            layer.handle.stack.forEach((nestedLayer) => {
                if (nestedLayer.route) {
                    const { path, methods } = nestedLayer.route;
                    routes.push({ path, methods });
                }
            });
        }
    });

    return responser.send(200, "All Routes Successfully Fetched", req, res, routes);
};


export const addRoutePermission = async (req, res) => {
    const reqData = req.body;
    const data = await routesServices.addRoutePermission(reqData)
    logger.info(data)
    return responser.send(200, "Successfully Route Added", req, res, data);
};

export const getRoutePermissions = async (req, res) => {
    const reqData = req.body;
    const data = await routesServices.getRoutes(reqData)
    logger.info(data)
    return responser.send(200, "Successfully Route Fetched", req, res, data);
};