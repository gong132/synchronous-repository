/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */

const apiUrl = 'http://10.90.48.22:80'; // yaowei
// const apiUrl = 'http://10.90.48.40:80'; // zzp
// const apiUrl = 'http://10.90.48.26:80'; // lqq

const proxyApi = [
  '/budget',
  '/user',
  '/cluster',
  '/log',
  '/temp',
  '/resource',
]

// export default [
//   {
//     context: proxyApi,
//     target: apiUrl,
//     changeOrigin: true,
//   },
// ];
export default {
  dev: {
    '/budget/': {
      target: apiUrl,
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
    '/contract/': {
      target: apiUrl,
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
    '/role/': {
      target: apiUrl,
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
    '/user/': {
      target: apiUrl,
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
    '/cluster/': {
      target: apiUrl,
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
    '/log/': {
      target: apiUrl,
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
    '/temp/': {
      target: apiUrl,
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
    '/resource/': {
      target: apiUrl,
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
  },
};
