import { useState } from 'react'

import { Box, Button } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { useEffectOnce } from 'react-use'

import { useUnsafeActiveTeam } from '@app/hooks/team'
import { setActiveTeamSetting } from '@app/store_actions/active-team'
import { getSettingFromTeam } from '@app/utils/user-teams'
import PageLayout from '@app/views/components/GlobalPageLayout'

import { Context } from './context'
import { usePageTabs } from './hooks/use-page-tabs'
import { InsightsPageTabs } from './List/PageTabs'
import { EmailCampaignStatus, SortableColumnsType } from './types'

const SORT_FIELD_INSIGHT_KEY = 'insight_layout_sort_field'

interface Props {
  disableSort?: boolean
  children: (renderProps: { sortField: SortableColumnsType }) => React.ReactNode
}

export default function InsightsPageLayout({
  disableSort = false,
  children
}: Props) {
  const dispatch = useDispatch()
  const activeTeam = useUnsafeActiveTeam()

  const [sortField, setSortField] = useState<SortableColumnsType>({
    label: 'Newest',
    value: '-created_at',
    ascending: false
  })

  const [, activeTab] = usePageTabs()
  const [status, setStatus] = useState<Nullable<EmailCampaignStatus>>(activeTab)

  useEffectOnce(() => {
    const savedSortField = getSettingFromTeam(
      activeTeam,
      SORT_FIELD_INSIGHT_KEY
    )

    if (savedSortField) {
      setSortField(savedSortField)
    }
  })

  const handleChangeSort = (item: SortableColumnsType) => {
    dispatch(setActiveTeamSetting(SORT_FIELD_INSIGHT_KEY, item))
    setSortField(item)
  }

  return (
    <Context.Provider
      value={{
        sortBy: sortField,
        status: status || 'executed'
      }}
    >
      <PageLayout gutter={0}>
        <Box m={4} mb={0}>
          <PageLayout.Header title="Insight">
            <Box ml={1}>
              <Button variant="outlined" href="/dashboard/marketing">
                Visit Marketing Center
              </Button>
            </Box>
          </PageLayout.Header>
        </Box>

        <PageLayout.Main>
          <Box mx={4}>
            <InsightsPageTabs
              disableSort={disableSort}
              onChangeSort={handleChangeSort}
              onChangeTab={setStatus}
            />
            {children({ sortField })}
          </Box>
        </PageLayout.Main>
      </PageLayout>
    </Context.Provider>
  )
}
