export function setupFullStory(user: IUser) {
  if (window?.FS && user) {
    window.FS.identify(user.id, {
      name: user.display_name,
      email: user.email
    })

    // We check for an ENV variable (ENABLE_FULLSTORY) which is set on deployed
    // Heroku instances. If it's set, we continue recording, otherwise we stop
    if (!process.env.ENABLE_FULLSTORY || !user) {
      window.FS.shutdown()
    }
  }
}
