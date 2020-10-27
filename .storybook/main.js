module.exports = {
  "stories": [
    "../app/views/components/**/*.story.mdx",
    "../app/views/components/**/*.story.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "storybook-dark-mode/register"
  ]
}
