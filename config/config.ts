import { defineConfig } from 'umi';
import routes from './routes';
import theme from './theme';
export default defineConfig({
  locale: {
    antd: true,
    title: true,
    baseNavigator: false,
    baseSeparator: '-',
    default: 'zh-CN',
  },
  theme,
  routes,
  hash: true,
  title: 'CRM',

/*   externals: {
    'react': 'window.React',
    'react-dom': 'window.ReactDOM',
  }, */
/*   output: process.env.NODE_ENV === 'development' ? [
    'https://gw.alipayobjects.com/os/lib/react/16.13.1/umd/react.development.js',
    'https://gw.alipayobjects.com/os/lib/react-dom/16.13.1/umd/react-dom.development.js',
  ] : [
    './react.production.min.js',
    './react-dom.production.min.js',
  ],
  extraBabelPlugins: [
    ['import', { libraryName: 'antd', style: true }], // `style: true` 会加载 less 文件
  ], */
/*   chunks: ['vendors', 'umi'],
  chainWebpack: function (config, { webpack }) {
    config.merge({
      optimization: {
        minimize: true,
        splitChunks: {
          chunks: 'all',
          minSize: 30000,
          minChunks: 3,
          automaticNameDelimiter: '.',
          cacheGroups: {
            vendor: {
              name: 'vendors',
              test({ resource }) {
                return /[\\/]node_modules[\\/]/.test(resource);
              },
              priority: 10,
            },
          },
        },
      }
    });
  }, */
  devServer: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://crm-front.esmtong.cn',
        // pathRewrite: { '^/api': '' },
        changeOrigin: true,
      },
    },
  },
});
