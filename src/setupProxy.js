const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/ws',
    createProxyMiddleware({
      target: `ws://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`,
      changeOrigin: true,
      ws: true,
    })
  );
  app.use(
    '/create',
    createProxyMiddleware({
      target: `${process.env.SERVER_PROTOCOL}://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`,
      changeOrigin: true,
    })
  );
};
