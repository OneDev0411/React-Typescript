import React from 'react'
import { Helmet } from 'react-helmet'

import PageLayout from 'components/GlobalPageLayout'

import { PageTabs, TabLink } from 'components/PageTabs'

const urlGenerator = url => `/dashboard/insights${url}`

function InsightsLayout({ sentCount, scheduledCount, children }) {
  const currentUrl = window.location.pathname
  const Items = [
    {
      label: `Sent (${sentCount})`,
      to: urlGenerator('/')
    },
    {
      label: `Scheduled (${scheduledCount})`,
      to: urlGenerator('/scheduled')
    }
  ]

  return (
    <React.Fragment>
      <Helmet>
        <title>Insights | Rechat</title>
      </Helmet>
      <PageLayout>
        <PageLayout.Header title="Email Insight" />
        <PageLayout.Main>
          <PageTabs
            defaultValue={currentUrl}
            tabs={Items.map(({ label, to }, i) => {
              return <TabLink key={i} label={label} to={to} value={to} />
            })}
          />

          <div>{children}</div>
        </PageLayout.Main>
      </PageLayout>
    </React.Fragment>
  )
}

export default InsightsLayout
