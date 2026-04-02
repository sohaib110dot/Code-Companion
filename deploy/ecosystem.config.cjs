module.exports = {
  apps: [
    {
      name: "fastaudio-api",
      script: "/var/www/fastaudio/api/index.cjs",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
      error_file: "/var/log/fastaudio/api-error.log",
      out_file: "/var/log/fastaudio/api-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
