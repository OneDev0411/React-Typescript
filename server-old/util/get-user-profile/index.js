import getUserProfile from '../../../app/models/user/get-self'

export default async function getProfile(session) {
  let user

  try {
    if (session.user) {
      user = await getUserProfile(session.user.access_token)

      // attach tokens into user profile object
      user = {
        ...user,
        ...session.user
      }
    }
  } catch (e) {
    console.log('getProfile', e)
  }

  return user
}
