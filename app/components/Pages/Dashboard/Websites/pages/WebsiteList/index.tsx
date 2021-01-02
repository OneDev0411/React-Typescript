import React, { memo } from 'react'

import { useTitle } from 'react-use'

import { RouteComponentProps } from 'react-router'

import { Box, Grid } from '@material-ui/core'

import PageLayout from 'components/GlobalPageLayout'

import WebsiteListTabs, {
  WebsiteListTabsProps
} from '../../components/WebsiteListTabs'

import WebsiteListInstances from '../../components/WebsiteListInstances'
import WebsiteListTemplates from '../../components/WebsiteListTemplates'

type WebsiteListProps = RouteComponentProps<
  { type?: WebsiteListTabsProps['type'] },
  {}
>

function WebsiteList({ params }: WebsiteListProps) {
  useTitle('Websites | Rechat')

  const type = params.type || 'MyWebsites'

  return (
    <PageLayout position="relative" overflow="hidden">
      <PageLayout.Header title="Website Builder" />
      <PageLayout.Main>
        <WebsiteListTabs type={type} />
        <Box paddingLeft={1} paddingRight={1} paddingTop={3}>
          <Grid container spacing={2}>
            {type === 'MyWebsites' ? (
              <WebsiteListInstances />
            ) : (
              <WebsiteListTemplates type={type} />
            )}
          </Grid>
        </Box>
      </PageLayout.Main>
    </PageLayout>
  )
}

export default memo(WebsiteList)
