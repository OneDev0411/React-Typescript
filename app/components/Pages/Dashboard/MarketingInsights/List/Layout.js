import React, { useState } from 'react'

import { Box, Button, Chip, makeStyles } from '@material-ui/core'
import { Helmet } from 'react-helmet'
import { useSelector, useDispatch } from 'react-redux'
import { browserHistory } from 'react-router'
import { useEffectOnce } from 'react-use'

import { setUserSetting } from 'actions/user/set-setting'
import PageLayout from 'components/GlobalPageLayout'
import { PageTabs, Tab, TabLink } from 'components/PageTabs'
import { selectUser } from 'selectors/user'
import { getUserSettingsInActiveTeam } from 'utils/user-teams'

import SortField from './SortField'

const urlGenerator = (url = '') => `/dashboard/insights${url}`

const useStyles = makeStyles(theme => ({
  emailCount: {
    marginLeft: theme.spacing(0.5),
    cursor: 'pointer'
  }
}))
const SORT_FIELD_INSIGHT_KEY = 'insight_layout_sort_field'

function InsightsLayout({
  sentCount,
  scheduledCount,
  onCreateEmail,
  renderContent
}) {
  const classes = useStyles()
  const user = useSelector(selectUser)
  const dispatch = useDispatch()
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

  useEffectOnce(() => {
    const savedSortField = getUserSettingsInActiveTeam(
      user,
      SORT_FIELD_INSIGHT_KEY
    )

    if (savedSortField) {
      setSortField(savedSortField)
    }
  })

  const handleSortChange = async item => {
    dispatch(setUserSetting(SORT_FIELD_INSIGHT_KEY, item))
    setSortField(item)
  }

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
                    onChange={handleSortChange}
                  />
                }
              />
            ]}
          />

          <Box mt={1.5} flex="1 1 auto">
            {renderContent({
              sortBy: sortField,
              onChangeSort: handleSortChange
            })}
          </Box>
        </PageLayout.Main>
      </PageLayout>
    </>
  )
}

export default InsightsLayout
