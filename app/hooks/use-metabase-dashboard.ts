import { useState } from 'react'
import { useAsync } from 'react-use'

import { useSelector } from 'react-redux'

import { selectUser } from 'selectors/user'
import { getActiveBrand, getActiveTeamId } from 'utils/user-teams'

import dashboards, { IDashboard } from 'constants/metabase'

export function useMetaBaseDashboard(key: string) {
  const [analyticsUrl, setAnalyticsUrl] = useState<string>()

  const user = useSelector(selectUser)
  const activeBrand = getActiveBrand(user)
  const activeBrandId = getActiveTeamId(user)
  const brandType: IBrandType = activeBrand?.brand_type!

  const dashboard: IDashboard = brandType ? dashboards[brandType][key] : null

  useAsync(async () => {
    if (dashboard) {
      const data = new TextEncoder().encode(user.access_token)
      const crypted = await crypto.subtle.digest('SHA-512', data)
      const hash = Array.from(new Uint8Array(crypted))
      const hex = hash.map(b => b.toString(16).padStart(2, '0')).join('')

      const base = `https://rechat.metabaseapp.com/public/dashboard/${dashboard?.id}`

      setAnalyticsUrl(
        `${base}?brand=${activeBrandId}&` +
          `token=${hex}#hide_parameters=token,brand&titled=false`
      )
    }
  }, [user.access_token, key])

  return {
    analyticsUrl,
    dashboard,
    brandType
  }
}
