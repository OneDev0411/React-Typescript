import { useState } from 'react'

import { Chip, makeStyles } from '@material-ui/core'
import { useLocation } from 'react-use'

import { PageTabs, Tab, TabLink } from '@app/views/components/PageTabs'

import { SortableColumnsType } from '../Insight/SortField'

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
}

export function InsightsPageTabs({ stats }: Props) {
  const classes = useStyles()

  const location = useLocation()

  const [sortField, setSortField] = useState<SortableColumnsType>({
    label: 'Newest',
    value: 'title-date',
    ascending: false
  })

  const items = [
    {
      label: 'Sent',
      count: stats?.sent,
      to: '/dashboard/insights'
    },
    {
      label: 'Scheduled',
      count: stats?.scheduled,
      to: '/dashboard/insights/scheduled'
    },
    {
      label: 'Instagram',
      to: '/dashboard/insights/scheduled/social-post'
    }
  ]

  return (
    <PageTabs
      defaultValue={location.pathname as string}
      tabs={items.map(({ label, count, to }) => (
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
          label={<SortFields label={sortField.label} onChange={setSortField} />}
        />
      ]}
    />
  )
}
