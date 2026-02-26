/**
 * PolicyTree Web - Webpack 配置覆盖文件
 * 用于优化开发体验和热更新性能
 * 
 * 最后更新时间: 2026-02-21 16:30
 * 编辑人: Performance-Optimization-Specialist
 */

const path = require('path');
const { override, addWebpackPlugin, adjustStyleLoaders, addWebpackResolve } = require('customize-cra');
const webpack = require('webpack');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin({
  outputFormat: 'humanVerbose',
  outputTarget: path.resolve(__dirname, 'webpack-performance.log'),
  disable: process.env.NODE_ENV === 'production' || process.env.MEASURE === 'false',
});

// 检测是否启用性能测量
const shouldMeasure = process.env.MEASURE === 'true';

// 优化配置
const optimizationOverrides = (config) => {
  // 开发环境优化
  if (process.env.NODE_ENV === 'development') {
    // 启用持久化缓存
    config.cache = {
      type: 'filesystem',
      version: `${require('./package.json').version}-${Date.now()}`,
      cacheDirectory: path.resolve(__dirname, 'node_modules/.cache/webpack'),
      store: 'pack',
      buildDependencies: {
        defaultWebpack: ['webpack/lib/'],
        config: [__filename],
      },
    };

    // 优化模块解析
    config.resolve = {
      ...config.resolve,
      unsafeCache: true,
      symlinks: false,
    };

    // 优化模块处理
    config.module = {
      ...config.module,
      unsafeCache: true,
    };

    // 优化输出配置
    config.output = {
      ...config.output,
      // 开发环境使用更简单的文件名格式
      filename: 'static/js/[name].js',
      chunkFilename: 'static/js/[name].chunk.js',
      // 启用路径信息（有助于调试）
      pathinfo: false,
    };

    // 优化 Source Map
    config.devtool = 'eval-cheap-module-source-map';

    // 优化 watch 模式
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/build/**',
        '**/*.test.js',
        '**/*.spec.js',
      ],
      aggregateTimeout: 300,
      poll: 1000,
    };

    // 优化性能提示
    config.performance = {
      hints: false,
    };

    // 优化 stats 输出
    config.stats = {
      preset: 'minimal',
      moduleTrace: true,
      errorDetails: true,
    };
  }

  return config;
};

// 开发服务器配置覆盖
const devServerOverrides = () => (configFunction) => {
  return (proxy, allowedHost) => {
    const config = configFunction(proxy, allowedHost);
    
    // 优化热更新配置
    config.hot = true;
    config.liveReload = false;
    
    // 优化客户端配置
    config.client = {
      ...config.client,
      overlay: {
        errors: true,
        warnings: false,
        runtimeErrors: true,
      },
      progress: false,
      reconnect: 5,
    };

    // 优化静态资源服务
    config.static = {
      ...config.static,
      watch: {
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/src/**',
        ],
      },
    };

    // 优化压缩
    config.compress = true;

    // 优化 WebSocket 配置
    config.webSocketServer = {
      type: 'ws',
      options: {
        path: '/ws',
      },
    };

    return config;
  };
};

// 插件配置
const pluginOverrides = (config) => {
  // 定义环境变量
  const envPlugin = new webpack.DefinePlugin({
    'process.env.FAST_REFRESH': JSON.stringify(true),
    'process.env.WDS_SOCKET_PORT': JSON.stringify(process.env.WDS_SOCKET_PORT || 0),
  });

  // 优化模块标识符
  const namedModulesPlugin = new webpack.ids.NamedModuleIdsPlugin({
    context: path.resolve(__dirname, 'src'),
  });

  // 添加插件
  if (!config.plugins) {
    config.plugins = [];
  }

  // 只在开发环境添加优化插件
  if (process.env.NODE_ENV === 'development') {
    config.plugins.push(envPlugin);
    config.plugins.push(namedModulesPlugin);
  }

  return config;
};

// 模块规则覆盖
const moduleOverrides = (config) => {
  // 优化 Babel-loader 配置
  const babelLoaderRule = config.module.rules.find(
    rule => rule.oneOf && rule.oneOf.some(
      r => r.loader && r.loader.includes('babel-loader')
    )
  );

  if (babelLoaderRule && babelLoaderRule.oneOf) {
    babelLoaderRule.oneOf.forEach(rule => {
      if (rule.loader && rule.loader.includes('babel-loader') && rule.options) {
        // 优化 Babel 缓存
        rule.options.cacheDirectory = true;
        rule.options.cacheCompression = false;
        rule.options.cacheIdentifier = `babel-loader-${require('./package.json').version}`;
      }
    });
  }

  // 优化 CSS 处理
  const cssLoaderRule = config.module.rules.find(
    rule => rule.oneOf && rule.oneOf.some(
      r => r.test && r.test.toString().includes('css')
    )
  );

  if (cssLoaderRule && cssLoaderRule.oneOf) {
    cssLoaderRule.oneOf.forEach(rule => {
      if (rule.use && Array.isArray(rule.use)) {
        rule.use.forEach(loader => {
          if (typeof loader === 'object' && loader.loader && loader.loader.includes('css-loader')) {
            // 优化 CSS-loader
            loader.options = {
              ...loader.options,
              importLoaders: 1,
              modules: {
                ...loader.options?.modules,
                exportOnlyLocals: false,
              },
            };
          }
        });
      }
    });
  }

  return config;
};

// 主配置覆盖函数
const webpackOverrides = override(
  optimizationOverrides,
  pluginOverrides,
  moduleOverrides,
  addWebpackResolve({
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
    },
  })
);

// 包装性能测量
const measuredOverrides = (config) => {
  const modifiedConfig = webpackOverrides(config);
  
  if (shouldMeasure) {
    return smp.wrap(modifiedConfig);
  }
  
  return modifiedConfig;
};

module.exports = {
  webpack: measuredOverrides,
  devServer: devServerOverrides(),
};

// 最后更新时间: 2026-02-21 16:30
// 编辑人: Performance-Optimization-Specialist
