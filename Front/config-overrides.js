const { overrideDevServer } = require("customize-cra");

const devServerConfig = () => (config) => {
  config.allowedHosts = "all";
  return config;
};

module.exports = {
  webpack: (config, env) => {
    // Find the rule that contains "oneOf"
    const ruleWithOneOf = config.module.rules.find((rule) => Array.isArray(rule.oneOf));

    if (!ruleWithOneOf) {
      console.warn("⚠️ Could not find Webpack 'oneOf' rule");
      return config;
    }

    // Correct: iterate over ruleWithOneOf.oneOf
    ruleWithOneOf.oneOf.forEach((rule) => {
      if (
        rule.use &&
        Array.isArray(rule.use) &&
        rule.use.some((use) => use.loader && use.loader.includes("postcss-loader"))
      ) {
        rule.use.forEach((use) => {
          if (use.loader && use.loader.includes("postcss-loader")) {
            use.options = use.options || {};
            use.options.postcssOptions = use.options.postcssOptions || {};
            use.options.postcssOptions.config = false;
          }
        });
      }
    });

    return config;
  },

  devServer: overrideDevServer(devServerConfig()),
};
