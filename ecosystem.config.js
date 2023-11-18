module.exports = {
  apps: [
    {
      name: "Backend_conquistaLanche_2.0",
      script: "./src/app.js",
      watch: true,
      env: {
        PORT: 3002, // mudar para uma porta não utilizada
        NODE_ENV: "development",
      },
      env_production: {
        PORT: 80,
        NODE_ENV: "production",
      },
      env_development: {
        PORT: 3002,
        NODE_ENV: "development",
      },
    },
  ],q
};
