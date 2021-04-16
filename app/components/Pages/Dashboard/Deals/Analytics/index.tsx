import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import PageLayout from 'components/GlobalPageLayout'
import { getActiveTeam } from 'utils/user-teams'
import IframeResizer from 'iframe-resizer-react'
import dashboards from './dashboards'
import { browserHistory, WithRouterProps } from 'react-router'
import { PageTabs, Tab, TabLink, DropdownTab } from 'components/PageTabs'
import AnalyticsDropdownTab from './DropdownTab'


export default function Analytics(props: WithRouterProps & StateProps) {
  const { dashboard: key } = props.params

  const { user, deals } = useSelector(({ user, deals }: IAppState) => ({
    user,
    deals: deals.list
  }))

  const { brand } = getActiveTeam(user)

  const dashboard = dashboards?.[brand.brand_type]?.[key]

  const [ analytics, setAnalytics ] = useState()

  useEffect(async () => {
    const data = new TextEncoder().encode(user.access_token)
    const crypted = await crypto.subtle.digest('SHA-512', data)
    const hash = Array.from(new Uint8Array(crypted))
    const hex = hash.map(b => b.toString(16).padStart(2, '0')).join('')

    const base = `https://rechat.metabaseapp.com/public/dashboard/${dashboard.id}`

    setAnalytics(`${base}?brand=${brand.id}&token=${hex}#hide_parameters=token,brand&titled=false`)
  }, [user.access_token, brand.id])

  if (!dashboard) {
    return browserHistory.push('/oops')
  }

  return (
    <PageLayout>
      <PageLayout.Header title={`Deals Analytics: ${dashboard.label}`} />
      <PageLayout.Main>
        <PageTabs
          tabs={[
            <AnalyticsDropdownTab
              brand_type={brand.brand_type}
            />
          ]}
        />
        { analytics &&
          <IframeResizer
            src={analytics}
            frameBorder="0"
            width="100%"
            allowtransparency>
          </IframeResizer>
        }
      </PageLayout.Main>
    </PageLayout>
  )
}
