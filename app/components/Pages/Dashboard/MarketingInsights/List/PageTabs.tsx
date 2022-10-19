import { useMemo } from 'react'

import { Chip, makeStyles } from '@material-ui/core'
import { useLocation } from 'react-use'

import { PageTabs, Tab, TabLink } from '@app/views/components/PageTabs'

import { useHasSuperCampaignAccess } from '../../SuperCampaigns/hooks/use-has-super-campaign-access'
import { useInsightsContext } from '../context/use-insights-context'
import { SortableColumnsType } from '../types'

import { SortFields } from './SortField'

const useStyles = makeStyles(
  theme => ({
    emailCount: {
      marginLeft: theme.spacing(0.5),
      cursor: 'pointer'
    }
  }),
  {
    name: 'Insights-List-PageTabs'
  }
)

interface Props {
  stats: {
    sent: number
    scheduled: number
  }
  onChangeSort: (field: SortableColumnsType) => void
}

export function InsightsPageTabs({ stats, onChangeSort }: Props) {
  const classes = useStyles()
  const location = useLocation()
  const hasSuperCampaignAccess = useHasSuperCampaignAccess()
  const { sortBy } = useInsightsContext()

  const items = useMemo(() => {
    let list = [
      {
        label: 'Sent',
        value: 'executed',
        count: stats?.sent,
        to: '/dashboard/insights'
      },
      {
        label: 'Scheduled',
        value: 'scheduled',
        count: stats?.scheduled,
        to: '/dashboard/insights/scheduled'
      },
      {
        label: 'Instagram',
        to: '/dashboard/insights/social-post'
      }
    ]

    if (hasSuperCampaignAccess) {
      list = [
        ...list,
        {
          label: 'Campaigns',
          to: '/dashboard/insights/super-campaign'
        }
      ]
    }

    return list
  }, [stats, hasSuperCampaignAccess])

  return (
    <PageTabs
      defaultValue={location.pathname as string}
      onChange={console.log}
      tabs={items?.map(({ label, value, count, to }) => (
        <TabLink
          key={`Tab-${label}`}
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
      actions={[
        <Tab
          key="sort-field"
          label={<SortFields label={sortBy.label} onChange={onChangeSort} />}
        />
      ]}
    />
  )
}
