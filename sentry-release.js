const SentryCli = require('@sentry/cli')

async function release() {
  const cli = new SentryCli()
  const version = process.env.CI_COMMIT_SHA

  try {
    console.log('[ Sentry ] Providing a new release:', version)
    await cli.releases.new(version)

    console.log('[ Sentry ] Deploying...')
    await cli.releases.uploadSourceMaps(version, {
      release: version,
      include: ['.'],
      ignore: ['node_modules']
    })

    console.log('[ Sentry ] Finalizing deploy.')
    await cli.releases.finalize(version)

    console.log('[ Sentry ] Deploy finished.')
  } catch (e) {
    console.log(e)
  }
}

release()
