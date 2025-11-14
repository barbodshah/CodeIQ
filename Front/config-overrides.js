const { overrideDevServer } = require("customize-cra");

const devServerConfig = () => (config) => {
  config.allowedHosts = "all"; // This allows all hosts
  return config;
};

module.exports = {
  webpack: (config, env) => config,
  devServer: overrideDevServer(devServerConfig()),
};
