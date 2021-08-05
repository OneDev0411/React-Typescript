export function setupFullStory(user: IUser) {
  // We only record sessions on FullStory if it's not on development environment
  // That includes beta.rechat.com

  if (window?.FS && user) {
    window.FS.identify(user.id, {
      name: user.display_name,
      email: user.email
    })

    if (!process.env.ENABLE_FULLSTORY) {
      window.FS.shutdown()
    }
  }
}
