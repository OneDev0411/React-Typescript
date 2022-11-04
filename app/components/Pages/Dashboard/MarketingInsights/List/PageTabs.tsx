import { useCallback } from 'react'

import { Chip, makeStyles } from '@material-ui/core'
import { useLocation } from 'react-use'

import { PageTabs, Tab, TabLink } from '@app/views/components/PageTabs'

import { useInsightsContext } from '../context/use-insights-context'
import { usePageTabs } from '../hooks/use-page-tabs'
import { EmailCampaignStatus, SortableColumnsType } from '../types'

import { useInsightsCounter } from './queries/use-insights-counter'
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
  disableSort: boolean
  onChangeSort: (field: SortableColumnsType) => void
  onChangeTab: (tab: Nullable<EmailCampaignStatus>) => void
}

export function InsightsPageTabs({
  disableSort = false,
  onChangeTab,
  onChangeSort
}: Props) {
  const classes = useStyles()
  const location = useLocation()
  const { sortBy } = useInsightsContext()

  const badgeCounters = useInsightsCounter()
  const [tabs] = usePageTabs(badgeCounters)

  const handleChangeTab = useCallback(
    (value: string) => {
      const tab = tabs?.find(({ to }) => to === value)?.value

      tab && onChangeTab(tab)
    },
    [tabs, onChangeTab]
  )

  return (
    <PageTabs
      defaultValue={location.pathname as string}
      onChange={handleChangeTab}
      tabs={tabs?.map(({ label, badgeCounter, to }) => (
        <TabLink
          key={`Tab-${label}`}
          label={
            <span>
              {label}
              {Number(badgeCounter) > 0 && (
                <Chip
                  variant="outlined"
                  size="small"
                  label={badgeCounter}
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
        !disableSort
          ? [
              <Tab
                key="sort-field"
                label={
                  <SortFields label={sortBy.label} onChange={onChangeSort} />
                }
              />
            ]
          : []
      }
    />
  )
}
