import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import PageLayout from 'components/GlobalPageLayout'
import { getActiveTeamId } from 'utils/user-teams'
import IframeResizer from 'iframe-resizer-react'

const dashboards = {
  production: '4aa9824f-d0c5-4e74-8a83-dbe5079c3073',
  agents: '0385fcae-5261-4154-b29a-93fd4cc29ef5'
}

export default function Analytics(props: WithRouterProps & StateProps) {
  const { dashboard } = props.params

  const { user, deals } = useSelector(({ user, deals }: IAppState) => ({
    user,
    deals: deals.list
  }))

  const brand = getActiveTeamId(user)

  const [ analytics, setAnalytics ] = useState()

  useEffect(async () => {
    const data = new TextEncoder().encode(user.access_token)
    const crypted = await crypto.subtle.digest('SHA-512', data)
    const hash = Array.from(new Uint8Array(crypted))
    const hex = hash.map(b => b.toString(16).padStart(2, '0')).join('')

    const base = `https://rechat.metabaseapp.com/public/dashboard/${dashboards[dashboard]}`

    setAnalytics(`${base}?brand=${brand}&token=${hex}#hide_parameters=token,brand&titled=false`)
  }, [user.access_token, brand])

  return (
    <PageLayout>
      <PageLayout.Header title="Deals Analytics" />
      <PageLayout.Main>
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
