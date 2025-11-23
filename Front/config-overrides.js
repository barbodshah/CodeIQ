const { overrideDevServer } = require("customize-cra");

const devServerConfig = () => (config) => {
  config.allowedHosts = "all"; // This allows all hosts
  return config;
};

module.exports = {
  webpack: (config, env) => {
    // Ensure PostCSS is configured properly for Tailwind
    const oneOf = config.module.rules.find((rule) => rule.oneOf);
    if (oneOf) {
      oneOf.forEach((rule) => {
        if (rule.use && rule.use.some && rule.use.some((use) => use.loader && use.loader.includes("postcss-loader"))) {
          rule.use.forEach((use) => {
            if (use.loader && use.loader.includes("postcss-loader")) {
              use.options = use.options || {};
              use.options.postcssOptions = use.options.postcssOptions || {};
              use.options.postcssOptions.config = false;
            }
          });
        }
      });
    }
    return config;
  },
  devServer: overrideDevServer(devServerConfig()),
};
