module.exports = {
  apps: [
    {
      name: 'ziguealuga-backend',
      script: './server.js',
      cwd: '/var/www/ziguealuga/backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: '/var/log/pm2/ziguealuga-error.log',
      out_file: '/var/log/pm2/ziguealuga-out.log',
      log_file: '/var/log/pm2/ziguealuga-combined.log',
      time: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '500M',
      watch: false,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
