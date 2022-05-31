/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    // '/api/member': {
    //   // 要代理的地址
    //   // target: 'http://daily-eval.sunmeta.top',
    //   target: 'http://10.255.22.172:8080',
    //   // 配置了这个可以从 http 代理到 https
    //   // 依赖 origin 的功能可能需要这个，比如 cookie
    //   changeOrigin: true,
    // },
    '/api/': {
      // 要代理的地址
      target: 'http://gray-eval.sunmeta.top',
      // target: 'http://10.255.22.172:8080',
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
    },
  },
};
