export function setupFullStory(user: IUser) {
  // We only record sessions on FullStory if it's not on development environment
  // That includes beta.rechat.com

  if (
    process.env.NODE_ENV === 'production' &&
    process.env.APP_URL === 'https://app.rechat.com' &&
    window?.FS &&
    user
  ) {
    window.FS.identify(user.id, {
      name: user.display_name,
      email: user.email
    })
  }
}
