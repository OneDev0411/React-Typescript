import { useState } from 'react'
import { useDeepCompareEffect } from 'react-use'

import IframeResizer from 'iframe-resizer-react'

import { useSelector } from 'react-redux'

import { selectUser } from 'selectors/user'
import { getActiveTeamId } from 'utils/user-teams'

interface Props {
  dashboardId: UUID
}

export default function MetabaseDashboard({ dashboardId }: Props) {
  const [analyticsUrl, setAnalyticsUrl] = useState<string>()

  const user = useSelector(selectUser)
  const activeBrandId = getActiveTeamId(user)

  useDeepCompareEffect(() => {
    const makeURL = async () => {
      const data = new TextEncoder().encode(user.access_token)
      const crypted = await crypto.subtle.digest('SHA-512', data)
      const hash = Array.from(new Uint8Array(crypted))
      const hex = hash.map(b => b.toString(16).padStart(2, '0')).join('')

      const base = `https://rechat.metabaseapp.com/public/dashboard/${dashboardId}`

      setAnalyticsUrl(
        `${base}?brand=${activeBrandId}&` +
          `token=${hex}#hide_parameters=token,brand&titled=false`
      )
    }

    makeURL()
  }, [user, dashboardId])

  return (
    <IframeResizer
      src={analyticsUrl}
      style={{ width: '1px', minWidth: '100%' }}
      heightCalculationMethod="max"
      frameBorder="0"
      checkOrigin={false}
    />
  )
}
