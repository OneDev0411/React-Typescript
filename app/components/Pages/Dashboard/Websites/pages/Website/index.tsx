import { memo } from 'react'

import { WithRouterProps } from 'react-router'
import { useTitle } from 'react-use'

import PageLayout from 'components/GlobalPageLayout'

import WebsiteList from '../../components/WebsiteList'
import WebsiteTabs from '../../components/WebsiteTabs'
import WebsiteTemplates from '../../components/WebsiteTemplates'
import { myWebsitesTab } from '../../constants'
import useWebsiteTabsWithTemplates from '../../hooks/use-website-tabs-with-templates'
import useWebsiteTemplates from '../../hooks/use-website-templates'

type WebsiteProps = WithRouterProps<{ type?: string }, {}>

function Website({ params }: WebsiteProps) {
  useTitle('Websites | Rechat')

  const selectedTab = params.type || myWebsitesTab

  const isMyWebsitesTab = selectedTab === myWebsitesTab

  const {
    templates,
    isLoading: isTemplatesLoading,
    deleteTemplate
  } = useWebsiteTemplates()

  const tabsWithTemplates = useWebsiteTabsWithTemplates(templates)

  const tabTemplates = tabsWithTemplates[selectedTab]?.templates ?? []
  const tabTypes = tabsWithTemplates[selectedTab]?.types ?? []

  return (
    <PageLayout position="relative" overflow="hidden">
      <PageLayout.Header title="Websites" />
      <PageLayout.Main>
        <WebsiteTabs value={selectedTab} tabs={tabsWithTemplates} />
        {isMyWebsitesTab ? (
          <WebsiteList />
        ) : (
          <WebsiteTemplates
            types={tabTypes}
            items={tabTemplates}
            isLoading={isTemplatesLoading}
            onDelete={deleteTemplate}
          />
        )}
      </PageLayout.Main>
    </PageLayout>
  )
}

export default memo(Website)
