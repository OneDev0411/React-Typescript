export function setupFullStory(user: IUser) {
  if (window?.FS && user) {
    window.FS.identify(user.id, {
      name: user.display_name,
      email: user.email
    })
  }

  // We check for an ENV variable (ENABLE_FULLSTORY) which is set on deployed
  // Heroku instances. If it's set, we continue recording, otherwise we stop,
  // if Fullstory script is included in the app (which it is) it will record
  // the session no matter user is logged in or not. The indentify function above
  // just helps us have the info of those sessions which were recorded for
  // logged in users
  if (!process.env.ENABLE_FULLSTORY || !user) {
    window.FS?.shutdown()
  }
}
