import React, { memo, useEffect } from 'react'

import { useTitle } from 'react-use'

import { RouteComponentProps } from 'react-router'

import PageLayout from 'components/GlobalPageLayout'

import { goTo } from 'utils/go-to'

import WebsiteTabs, { WebsiteTabsProps } from '../../components/WebsiteTabs'

import WebsiteList from '../../components/WebsiteList'
import WebsiteTemplates from '../../components/WebsiteTemplates'
import { websiteTabs } from '../../constants'
import useWebsiteTemplates from '../../hooks/use-website-templates'

type WebsiteProps = RouteComponentProps<{ type?: WebsiteTabsProps['type'] }, {}>

function Website({ params }: WebsiteProps) {
  useTitle('Websites | Rechat')

  const type = params.type || websiteTabs.MyWebsites
  const {
    templates,
    isLoading: isTemplatesLoading,
    deleteTemplate
  } = useWebsiteTemplates()

  const hasAgentTab =
    isTemplatesLoading ||
    !!templates.find(
      template => template.template.template_type === websiteTabs.Agent
    )
  const hasPropertyTab =
    isTemplatesLoading ||
    !!templates.find(
      template => template.template.template_type === websiteTabs.Listing
    )

  const isEmptyTab =
    (type === websiteTabs.Agent && !hasAgentTab) ||
    (type === websiteTabs.Listing && !hasPropertyTab)

  useEffect(() => {
    if (isEmptyTab) {
      goTo('/dashboard/websites')
    }
  }, [isEmptyTab])

  if (isEmptyTab) {
    return null
  }

  return (
    <PageLayout position="relative" overflow="hidden">
      <PageLayout.Header title="Websites" />
      <PageLayout.Main>
        <WebsiteTabs
          type={type}
          hasAgentTab={hasAgentTab}
          hasPropertyTab={hasPropertyTab}
        />
        {type === websiteTabs.MyWebsites ? (
          <WebsiteList />
        ) : (
          <WebsiteTemplates
            type={type as IWebsiteTemplateType}
            items={templates}
            isLoading={isTemplatesLoading}
            onDelete={deleteTemplate}
          />
        )}
      </PageLayout.Main>
    </PageLayout>
  )
}

export default memo(Website)
