import getUserProfile from '../../../app/models/user/get-self'

export default async function getProfile(session) {
  let user

  try {
    if (session.user) {
      user = await getUserProfile(session.user.access_token)
      console.log('user', user)
      console.log('session.user', session.user)

      // attach tokens into user profile object
      user = {
        ...user,
        ...session.user
      }
    }
  } catch (e) {}

  return user
}
