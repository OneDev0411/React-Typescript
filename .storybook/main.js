const baseWebpackConfig = require('../webpack/base')

module.exports = {
  stories: [
    "../app/views/components/**/*.story.mdx",
    "../app/views/components/**/*.story.@(js|jsx|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "storybook-dark-mode/register"
  ],
  webpackFinal: async (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          ...baseWebpackConfig.resolve.alias,
        },
      },
      module: {
        ...config.module,
        rules: [
          ...config.module.rules,
          ...baseWebpackConfig.module.rules,
        ]
      }
    }
  }
}
