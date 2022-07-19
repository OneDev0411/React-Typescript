import { memo } from 'react'

import { WithRouterProps } from 'react-router'
import { useTitle } from 'react-use'

import PageLayout from 'components/GlobalPageLayout'

import WebsiteList from '../../components/WebsiteList'
import WebsiteTabs from '../../components/WebsiteTabs'
import WebsiteTemplates from '../../components/WebsiteTemplates'
import {
  presentationsRouteRoot,
  PRESENTATION_DEFAULT_TABS,
  PRESENTATION_TEMPLATE_TYPES
} from '../../constants'
import useWebsiteTabsWithTemplates from '../../hooks/use-website-tabs-with-templates'
import useWebsiteTemplates from '../../hooks/use-website-templates'

type WebsiteProps = WithRouterProps<{ type?: string }, {}>

function Presentation({ params }: WebsiteProps) {
  useTitle('Presentation | Rechat')

  const selectedTab = params.type || presentationsRouteRoot

  const isMyPresentationsTab = selectedTab === presentationsRouteRoot

  const {
    templates,
    isLoading: isTemplatesLoading,
    deleteTemplate
  } = useWebsiteTemplates({ typesWhiteList: PRESENTATION_TEMPLATE_TYPES })

  const tabsWithTemplates = useWebsiteTabsWithTemplates(
    templates,
    PRESENTATION_DEFAULT_TABS,
    false
  )

  const tabTemplates = tabsWithTemplates[selectedTab]?.templates ?? []
  const tabTypes = tabsWithTemplates[selectedTab]?.types ?? []

  return (
    <PageLayout position="relative" overflow="hidden">
      <PageLayout.Header title="Presentation" />
      <PageLayout.Main>
        <WebsiteTabs
          myTitle="Presentations"
          routeRoot={presentationsRouteRoot}
          value={selectedTab}
          tabs={tabsWithTemplates}
        />
        {isMyPresentationsTab ? (
          <WebsiteList
            title="Presentation"
            typesWhiteList={PRESENTATION_TEMPLATE_TYPES}
          />
        ) : (
          <WebsiteTemplates
            routeRoot="presentations"
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

export default memo(Presentation)
