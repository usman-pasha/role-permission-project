const config = {
  PORT: process.env.PORT || 4000,
  DB_CONNECTION: "mongodb://127.0.0.1:27017/myapp",
  JWT_SECRET_KEY: "usgygygu",
  JWT_VALIDITY: "2d",
  JWT_REFRESH_SECRET_KEY: "opiiyyf",
  JWT_REFRESH_VALIDITY: "7d",
};

export default config;
