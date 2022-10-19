import { useCallback } from 'react'

import { Chip, makeStyles } from '@material-ui/core'
import { useLocation } from 'react-use'

import { PageTabs, Tab, TabLink } from '@app/views/components/PageTabs'

import { useInsightsContext } from '../context/use-insights-context'
import { usePageTabs } from '../hooks/use-page-tabs'
import { PageTabStats, SortableColumnsType } from '../types'

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
  stats: PageTabStats
  onChangeSort: (field: SortableColumnsType) => void
  onChangeTab: (tab: string | undefined) => void
}

export function InsightsPageTabs({ stats, onChangeTab, onChangeSort }: Props) {
  const classes = useStyles()
  const location = useLocation()
  const { sortBy } = useInsightsContext()

  const [tabs] = usePageTabs(stats)

  const handleChangeTab = useCallback(
    (value: string) => {
      const tab = tabs?.find(({ to }) => to === value)?.value

      onChangeTab(tab)
    },
    [tabs, onChangeTab]
  )

  return (
    <PageTabs
      defaultValue={location.pathname as string}
      onChange={handleChangeTab}
      tabs={tabs?.map(({ label, count, to }) => (
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
