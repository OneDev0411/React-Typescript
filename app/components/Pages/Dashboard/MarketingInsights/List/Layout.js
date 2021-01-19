import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { browserHistory } from 'react-router'

import { Box, Button, Chip, makeStyles } from '@material-ui/core'

import PageLayout from 'components/GlobalPageLayout'

import { PageTabs, Tab, TabLink } from 'components/PageTabs'

import SortField from './SortField'

const urlGenerator = (url = '') => `/dashboard/insights${url}`

const useStyles = makeStyles(theme => ({
  emailCount: {
    marginLeft: theme.spacing(0.5),
    cursor: 'pointer'
  }
}))

function InsightsLayout({
  sentCount,
  scheduledCount,
  onCreateEmail,
  renderContent
}) {
  const classes = useStyles()
  const [sortField, setSortField] = useState({
    label: 'Newest',
    value: 'title-date',
    ascending: false
  })
  const currentUrl = window.location.pathname
  const Items = [
    {
      label: 'Sent',
      count: sentCount,
      to: urlGenerator()
    },
    {
      label: 'Scheduled',
      count: scheduledCount,
      to: urlGenerator('/scheduled')
    }
  ]

  return (
    <>
      <Helmet>
        <title>Email | Rechat</title>
      </Helmet>
      <PageLayout>
        <PageLayout.Header title="Email Insight" onCreateEmail={onCreateEmail}>
          <Box textAlign="right">
            <Button
              variant="outlined"
              size="large"
              onClick={() => browserHistory.push('/dashboard/marketing')}
            >
              Visit Marketing Center
            </Button>
          </Box>
        </PageLayout.Header>
        <PageLayout.Main>
          <PageTabs
            defaultValue={currentUrl}
            tabs={Items.map(({ label, count, to }, i) => (
              <TabLink
                key={i}
                label={
                  <span>
                    {label}
                    <Chip
                      variant="outlined"
                      size="small"
                      label={count}
                      className={classes.emailCount}
                    />
                  </span>
                }
                to={to}
                value={to}
              />
            ))}
            actions={[
              <Tab
                key="sort-field"
                label={
                  <SortField
                    sortLabel={sortField.label}
                    onChange={setSortField}
                  />
                }
              />
            ]}
          />

          <Box mt={1.5}>
            {renderContent({
              sortBy: sortField,
              onChangeSort: setSortField
            })}
          </Box>
        </PageLayout.Main>
      </PageLayout>
    </>
  )
}

export default InsightsLayout
