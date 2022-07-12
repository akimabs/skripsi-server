module.exports = {
  apps: [
    {
      name: 'server',
      script: 'dist/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],

  deploy: {
    production: {
      user: 'node',
      host: '47.254.215.117',
      ref: 'origin/main',
      repo: 'git@github.com:akimabs/skripsi-server.git',
      path: '/apps/skripsi-server',
      'post-deploy':
        'npm install && pm2 reload ecosystem.config.js --env production',
    },
  },
};
