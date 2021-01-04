import React, { memo } from 'react'

import { useTitle } from 'react-use'

import { RouteComponentProps } from 'react-router'

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
        {type === 'MyWebsites' ? (
          <WebsiteListInstances />
        ) : (
          <WebsiteListTemplates type={type} />
        )}
      </PageLayout.Main>
    </PageLayout>
  )
}

export default memo(WebsiteList)
