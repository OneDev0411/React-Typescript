import { Location } from 'history'
import { useEffectOnce } from 'react-use'

import signout from '@app/models/auth/signout'
import { logUserActivity } from '@app/models/user/log-activity'
import { createUrlSearch } from '@app/utils/helpers'
import { AnimatedLoader } from '@app/views/components/AnimatedLoader'

interface Props {
  location: Location
}

export default function SignOut(props: Props) {
  useEffectOnce(() => {
    async function sendLogAndRedirect() {
      try {
        await logUserActivity(
          {
            action: 'UserLoggedOut',
            object_class: 'UserActivityLogout',
            object: {
              type: 'user_activity_user_logout'
            }
          },
          true
        )
      } catch (e) {
        console.log(e)
      }

      const { redirectFromSignout, redirect_to, ...queryParams } =
        props.location.query

      const redirectPath = (redirectFromSignout ||
        redirect_to ||
        '/signin') as string

      const redirectFullPath = `${redirectPath}${
        queryParams ? createUrlSearch(queryParams, undefined, true) : ''
      }`

      await signout()

      window.location.replace(redirectFullPath)
    }

    sendLogAndRedirect()
  })

  return (
    <div className="signin-page-wrapper">
      <AnimatedLoader />
    </div>
  )
}
