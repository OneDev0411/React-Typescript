import { useEffectOnce } from 'react-use'

import { useSearchParams } from '@app/hooks/use-search-param'
import signout from '@app/models/auth/signout'
import { logUserActivity } from '@app/models/user/log-activity'
import { WithRouterProps } from '@app/routes/types'
import { withRouter } from '@app/routes/with-router'
import { AnimatedLoader } from '@app/views/components/AnimatedLoader'

function SignOut(props: WithRouterProps) {
  const [searchParams] = useSearchParams()
  const redirectFromSignout = searchParams.get('redirectFromSignout')
  const redirectTo = searchParams.get('redirect_to')

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

      const redirectPath = redirectFromSignout || redirectTo || '/signin'

      await signout()

      window.location.replace(redirectPath)
    }

    sendLogAndRedirect()
  })

  return (
    <div className="signin-page-wrapper">
      <AnimatedLoader />
    </div>
  )
}

export default withRouter(SignOut)
