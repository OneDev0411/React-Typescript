import React, { memo } from 'react'

import { useTitle } from 'react-use'

import { RouteComponentProps } from 'react-router'

import PageLayout from 'components/GlobalPageLayout'

import WebsiteTabs, { WebsiteTabsProps } from '../../components/WebsiteTabs'

import WebsiteList from '../../components/WebsiteList'
import WebsiteTemplates from '../../components/WebsiteTemplates'
import { websiteTabs } from '../../constants'

type WebsiteProps = RouteComponentProps<{ type?: WebsiteTabsProps['type'] }, {}>

function Website({ params }: WebsiteProps) {
  useTitle('Websites | Rechat')

  const type = params.type || websiteTabs.MyWebsites

  return (
    <PageLayout position="relative" overflow="hidden">
      <PageLayout.Header title="Website Builder" />
      <PageLayout.Main>
        <WebsiteTabs type={type} />
        {type === websiteTabs.MyWebsites ? (
          <WebsiteList />
        ) : (
          <WebsiteTemplates type={type as IWebsiteTemplateType} />
        )}
      </PageLayout.Main>
    </PageLayout>
  )
}

export default memo(Website)
