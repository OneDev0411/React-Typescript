import { Box, Button } from '@material-ui/core'

import PageLayout from '@app/views/components/GlobalPageLayout'

import { InsightsTable } from './InsightsTable'

export default function InsightsList() {
  return (
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
        <InsightsTable />
      </PageLayout.Main>
    </PageLayout>
  )
}
