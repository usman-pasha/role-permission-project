import http from "http";
import { Server as socketIoServer } from "socket.io";
import { app } from "./app.js";
import * as logger from "./utils/logs.js";
import config from "./config/index.js";

const port = config.PORT;
const server = http.createServer(app);

// server
server.listen(port, () => {
  logger.info(
    `App is running on port http://localhost:${port} \non ${app.get(
      "env"
    )} mode!`
  );
  logger.info("Press CTRL-C to stop\n");
});

server.on("close", () => {
  logger.info("Server closed");
});

process.on("SIGINT", () => {
  logger.info("Received SIGINT. Shutting down gracefully.");
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
});

// socketio connections
const io = new socketIoServer(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  logger.info(`User is connected For Socket ${socket.id}`);

  socket.on("disconnect", () => {
    logger.info(`User is disconnected For Socket ${socket.id}`);
  });
});

