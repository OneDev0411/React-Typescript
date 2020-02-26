import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { browserHistory } from 'react-router'

import { Box } from '@material-ui/core'

import PageLayout from 'components/GlobalPageLayout'

import { PageTabs, Tab, TabLink, TabSpacer } from 'components/PageTabs'
import Tooltip from 'components/tooltip'
import ActionButton from 'components/Button/ActionButton'

import { SortValues } from './helpers'
import SortField from './SortField'

const urlGenerator = url => `/dashboard/insights${url}`

function InsightsLayout({ sentCount, scheduledCount, renderContent }) {
  const [sortField, setSortField] = useState({
    label: 'Newest',
    value: SortValues.Newest,
    ascending: true
  })
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
        <title>Email | Rechat</title>
      </Helmet>
      <PageLayout>
        <PageLayout.Header title="My Email">
          <Box textAlign="right">
            <Tooltip placement="bottom">
              <ActionButton
                appearance="outline"
                onClick={() => browserHistory.push('/dashboard/marketing')}
              >
                Visit Marketing Center
              </ActionButton>
            </Tooltip>
          </Box>
        </PageLayout.Header>
        <PageLayout.Main>
          <PageTabs
            defaultValue={currentUrl}
            tabs={[
              ...Items.map(({ label, to }, i) => {
                return <TabLink key={i} label={label} to={to} value={to} />
              }),
              <TabSpacer key="spacer" />,
              <Tab
                key="sort-field"
                label={<SortField onChange={setSortField} />}
              />
            ]}
          />

          <div>
            {renderContent({
              sortBy: sortField,
              onChangeSort: setSortField
            })}
          </div>
        </PageLayout.Main>
      </PageLayout>
    </React.Fragment>
  )
}

export default InsightsLayout
