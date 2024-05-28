import adminRouter from "./admin.router.js";
import authRouter from "./auth.router.js";
import categoryRouter from "./category.router.js";
import postRouter from "./post.router.js";
import routeRouter from "./route.Router.js";
import userRouter from "./user.router.js";

const routes = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/category", categoryRouter);
  app.use("/api/post", postRouter);
  app.use("/api/user", userRouter);
  app.use("/api/router", routeRouter);
};

export { routes };
