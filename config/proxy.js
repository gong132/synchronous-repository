/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
// const apiUrl = 'http://172.20.10.8:80'

const apiUrl = 'http://10.90.48.22:80'; // yw
// const apiUrl = "http://10.90.48.40:80"; // zzp
// const apiUrl = 'http://10.90.48.26:80'; // lqq

export default {
  dev: {
    '/server/': {
      target: apiUrl,
      changeOrigin: true,
      pathRewrite: {
        '/server': '',
      },
    },
  },
};
