import React, { memo } from 'react'

import { useTitle } from 'react-use'

import { RouteComponentProps } from 'react-router'

import { Box } from '@material-ui/core'

import PageLayout from 'components/GlobalPageLayout'

import WebsiteListTabs, {
  WebsiteListTabsProps
} from '../../components/WebsiteListTabs'

import WebsiteListItems from '../../components/WebsiteListItems'

type WebsiteListProps = RouteComponentProps<
  { tab?: WebsiteListTabsProps['tab'] },
  {}
>

function WebsiteList({ params }: WebsiteListProps) {
  useTitle('Websites | Rechat')

  const tab = params.tab || 'mine'

  return (
    <PageLayout position="relative" overflow="hidden">
      <PageLayout.Header title="Website Builder" />
      <PageLayout.Main>
        <WebsiteListTabs tab={tab} />
        <Box paddingLeft={1} paddingRight={1} paddingTop={3}>
          <WebsiteListItems />
        </Box>
      </PageLayout.Main>
    </PageLayout>
  )
}

export default memo(WebsiteList)
