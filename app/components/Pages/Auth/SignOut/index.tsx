import { Location } from 'history'
import { useEffectOnce } from 'react-use'

import signout from '@app/models/auth/signout'
import { logUserActivity } from '@app/models/user/log-activity'
import { AnimatedLoader } from '@app/views/components/AnimatedLoader'

interface Props {
  location: Location
}

function createParams(params: Record<string, string>) {
  const queryString = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&')

  if (queryString.length > 0) {
    return `?${queryString}`
  }

  return ''
}

export default function SignOut(props: Props) {
  useEffectOnce(() => {
    async function sendLogAndRedirect() {
      try {
        await logUserActivity(
          {
            action: 'UserLoggedOut',
            object_sa: {}
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
        queryParams ? createParams(queryParams as Record<string, string>) : ''
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
