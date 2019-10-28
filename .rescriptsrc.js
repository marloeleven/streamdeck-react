const path = require('path');

const resolutions = {
  pi: path.resolve(__dirname, 'src/PropertyInspector'),
  containers: path.resolve(__dirname, 'src/PropertyInspector/containers'),
  components: path.resolve(__dirname, 'src/PropertyInspector/components'),
};

module.exports = [
  {
    //  externals and alias configuration
    webpack: config => {
      // JS
      config.resolve.alias = {
        ...resolutions,
        ...config.resolve.alias,
      };

      config.entry = {
        main: './src/index.js',
        // main: './src/Plugin/index.js',
        // Plugin: './src/Plugin/index.js',
        // PropertyInspector: './src/PropertyInspector/index.js',
      };

      config.output.path = __dirname + '/build';
      config.output.filename = 'build.js';

      config.optimization.splitChunks = {
        name: true,
      };

      config.optimization.runtimeChunk = false;

      return config;
    },
  },
];
