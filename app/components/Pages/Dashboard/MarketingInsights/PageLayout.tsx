import { useEffect, useState } from 'react'

import { Box, Button } from '@material-ui/core'
import { useDispatch } from 'react-redux'

import { useUnsafeActiveTeam } from '@app/hooks/team'
import { setActiveTeamSetting } from '@app/store_actions/active-team'
import { getSettingFromTeam } from '@app/utils/user-teams'
import PageLayout from '@app/views/components/GlobalPageLayout'

import { Context } from './context'
import { usePageTabs } from './hooks/use-page-tabs'
import { InsightsPageTabs } from './List/PageTabs'
import { EmailCampaignStatus, SortableColumnsType } from './types'

interface Props {
  sortKey: string
  sortOptions: SortableColumnsType[]
  disableSort?: boolean
  children: (renderProps: { sortField: SortableColumnsType }) => React.ReactNode
}

export default function InsightsPageLayout({
  sortKey,
  sortOptions,
  disableSort = false,
  children
}: Props) {
  const dispatch = useDispatch()
  const activeTeam = useUnsafeActiveTeam()

  const [sortField, setSortField] = useState<SortableColumnsType>(
    sortOptions[0]
  )

  const [, activeTab] = usePageTabs()
  const [status, setStatus] = useState<Nullable<EmailCampaignStatus>>(activeTab)

  useEffect(() => {
    const savedSortField = getSettingFromTeam(activeTeam, sortKey)

    if (savedSortField) {
      setSortField(savedSortField)
    }
  }, [sortKey, activeTeam])

  const handleChangeSort = (item: SortableColumnsType) => {
    dispatch(setActiveTeamSetting(sortKey, item))
    setSortField(item)
  }

  return (
    <Context.Provider
      value={{
        sortOptions,
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
