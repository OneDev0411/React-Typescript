import { useState } from 'react'

import { Box, Button, Chip, makeStyles } from '@material-ui/core'
import { Helmet } from 'react-helmet'
import { useDispatch } from 'react-redux'
import { browserHistory } from 'react-router'
import { useEffectOnce } from 'react-use'

import { useUnsafeActiveTeam } from '@app/hooks/team/use-unsafe-active-team'
import { setActiveTeamSetting } from '@app/store_actions/active-team'
import PageLayout from 'components/GlobalPageLayout'
import { PageTabs, Tab, TabLink } from 'components/PageTabs'
import { noop } from 'utils/helpers'
import { getSettingFromTeam } from 'utils/user-teams'

import { useHasSuperCampaignAccess } from '../../SuperCampaigns/hooks/use-has-super-campaign-access'

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
  sentCount = 0,
  scheduledCount = 0,
  onCreateEmail = noop,
  renderContent,
  hasSortFilter = true
}) {
  const classes = useStyles()
  const activeTeam = useUnsafeActiveTeam()
  const dispatch = useDispatch()
  const [sortField, setSortField] = useState({
    label: 'Newest',
    value: 'title-date',
    ascending: false
  })
  const currentUrl = window.location.pathname

  const items = [
    {
      label: 'Sent',
      count: sentCount,
      to: urlGenerator()
    },
    {
      label: 'Scheduled',
      count: scheduledCount,
      to: urlGenerator('/scheduled')
    },
    {
      label: 'Instagram',
      to: urlGenerator('/social-post')
    }
  ]

  const hasSuperCampaignAccess = useHasSuperCampaignAccess()

  if (hasSuperCampaignAccess) {
    items.push({
      label: 'Campaigns',
      to: urlGenerator('/super-campaign')
    })
  }

  useEffectOnce(() => {
    const savedSortField = getSettingFromTeam(
      activeTeam,
      SORT_FIELD_INSIGHT_KEY
    )

    if (savedSortField) {
      setSortField(savedSortField)
    }
  })

  const handleSortChange = async item => {
    dispatch(setActiveTeamSetting(SORT_FIELD_INSIGHT_KEY, item))
    setSortField(item)
  }

  return (
    <>
      <Helmet>
        <title>Insight | Rechat</title>
      </Helmet>
      <PageLayout>
        <PageLayout.Header title="Insight" onCreateEmail={onCreateEmail}>
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
            tabs={items.map(({ label, count, to }, i) => (
              <TabLink
                key={i}
                label={
                  <span>
                    {label}
                    {Number(count) > 0 && (
                      <Chip
                        variant="outlined"
                        size="small"
                        label={count}
                        className={classes.emailCount}
                      />
                    )}
                  </span>
                }
                to={to}
                value={to}
              />
            ))}
            actions={
              hasSortFilter && [
                <Tab
                  key="sort-field"
                  label={
                    <SortField
                      component="div"
                      sortLabel={sortField.label}
                      onChange={handleSortChange}
                    />
                  }
                />
              ]
            }
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
