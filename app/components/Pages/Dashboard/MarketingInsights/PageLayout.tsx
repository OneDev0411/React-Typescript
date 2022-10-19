import { useState } from 'react'

import { Box, Button } from '@material-ui/core'

import PageLayout from '@app/views/components/GlobalPageLayout'

import { Context } from './context'
import { usePageTabs } from './hooks/use-page-tabs'
import { InsightsPageTabs } from './List/PageTabs'
import { SortableColumnsType } from './types'

interface Props {
  disableSort?: boolean
  children: (renderProps: { sortField: SortableColumnsType }) => React.ReactNode
}

export default function InsightsPageLayout({
  disableSort = false,
  children
}: Props) {
  const [sortField, setSortField] = useState<SortableColumnsType>({
    label: 'Newest',
    value: 'title-date',
    ascending: false
  })

  const [, activeTab] = usePageTabs()
  const [status, setStatus] = useState(activeTab)

  return (
    <Context.Provider
      value={{
        sortBy: sortField,
        status
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
              stats={{
                executed: 0,
                scheduled: 0
              }}
              onChangeSort={setSortField}
              onChangeTab={setStatus}
            />
            {children({ sortField })}
          </Box>
        </PageLayout.Main>
      </PageLayout>
    </Context.Provider>
  )
}
