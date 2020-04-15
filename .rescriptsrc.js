const path = require('path');

const resolutions = {
  pi: path.resolve(__dirname, 'src/PropertyInspector'),
  containers: path.resolve(__dirname, 'src/PropertyInspector/containers'),
  components: path.resolve(__dirname, 'src/PropertyInspector/components'),
};

module.exports = [
  {
    //  externals and alias configuration
    webpack: (config) => {
      // JS
      config.resolve.alias = {
        ...resolutions,
        ...config.resolve.alias,
      };

      config.entry = {
        main: `./src/${process.env.ENTRY_FILE}`,
      };

      config.output.path = __dirname + '/build';
      config.output.filename = process.env.OUTPUT_FILE;

      config.optimization.splitChunks = {
        name: true,
      };

      config.optimization.runtimeChunk = false;

      return config;
    },
  },
];
