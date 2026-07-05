module.exports = {
  apps: [
    {
      name: 'profenglish',
      script: 'server.js',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
