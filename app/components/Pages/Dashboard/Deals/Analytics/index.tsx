import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import PageLayout from 'components/GlobalPageLayout'
import { getActiveTeamId } from 'utils/user-teams'

const dashboards = {
  production: '9964058b-c7c3-445a-95d1-b47eac657a87'
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

    const base = `https://metabase.rechat.com/public/dashboard/${dashboards[dashboard]}`

    setAnalytics(`${base}?brand=${brand}&token=${hex}#hide_parameters=token,brand&titled=false`)
  }, [user.access_token, brand])

  const frame = useRef()

  const analyticsLoaded = () => {
    if (!frame.current.contentDocument)
      return

    // TODO: RESIZE FRAME
  }

  return (
    <PageLayout>
      <PageLayout.Header title="Deals Analytics" />
      <PageLayout.Main>
        { analytics &&
          <iframe
            ref={frame}
            onLoad={ analyticsLoaded }
            src={analytics}
            frameBorder="0"
            width="100%"
            height="700"
            allowtransparency>
          </iframe>
        }
      </PageLayout.Main>
    </PageLayout>
  )
}
