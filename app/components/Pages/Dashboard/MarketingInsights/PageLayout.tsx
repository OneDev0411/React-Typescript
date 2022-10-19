import { useState } from 'react'

import { Box, Button } from '@material-ui/core'

import PageLayout from '@app/views/components/GlobalPageLayout'

import { Context } from './context'
import { InsightsPageTabs } from './List/PageTabs'
import { SortableColumnsType } from './types'

interface Props {
  children: React.ReactNode
}

export default function InsightsPageLayout({ children }: Props) {
  const [sortField, setSortField] = useState<SortableColumnsType>({
    label: 'Newest',
    value: 'title-date',
    ascending: false
  })

  return (
    <Context.Provider
      value={{
        sortBy: sortField,
        status: 'executed'
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
              stats={{
                sent: 0,
                scheduled: 0
              }}
              onChangeSort={setSortField}
            />
            {children}
          </Box>
        </PageLayout.Main>
      </PageLayout>
    </Context.Provider>
  )
}
