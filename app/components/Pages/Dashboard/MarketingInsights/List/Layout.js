import React from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router'

import Header from 'components/GlobalHeader'
import { PageTabs, Tab } from 'components/PageTabs'

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
      <Header title="Email Insight" />
      <PageTabs
        defaultValue={currentUrl}
        tabs={Items.map(({ label, to }, i) => {
          return (
            <Tab key={i} component={Link} label={label} to={to} value={to} />
          )
        })}
      />

      <div>{children}</div>
    </React.Fragment>
  )
}

export default InsightsLayout
