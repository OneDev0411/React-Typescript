require('babel-core/register')

const fs = require('fs')

const appConfig = require('./config/private/development').default

const { user, chromeOptions } = appConfig.test

module.exports = (settings => {
  const seleniumServerFileName = fs.readdirSync(settings.selenium.server_path)
  const chromeDriverFileName = fs.readdirSync(
    settings.selenium.cli_args['webdriver.chrome.driver']
  )
  const geckoDriverFileName = fs.readdirSync(
    settings.selenium.cli_args['webdriver.gecko.driver']
  )

  settings.selenium.server_path += seleniumServerFileName
  settings.selenium.cli_args['webdriver.chrome.driver'] +=
    chromeDriverFileName[0]
  settings.selenium.cli_args['webdriver.gecko.driver'] += geckoDriverFileName[0]

  if (appConfig.app_url) {
    settings.test_settings.default.launch_url = appConfig.app_url
  }

  if (user) {
    const _globals = {
      ...settings.test_settings.default.globals,
      rechat_username: user.email,
      rechat_password: user.password
    }

    settings.test_settings.default.globals = _globals
  }

  if (chromeOptions) {
    settings.test_settings.default.desiredCapabilities = {
      ...settings.test_settings.default.desiredCapabilities,
      chromeOptions
    }
  }

  return settings
})(require('./nightwatch.json'))
