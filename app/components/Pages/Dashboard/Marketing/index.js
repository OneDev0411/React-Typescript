import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { withRouter } from 'react-router'
import { Helmet } from 'react-helmet'

import { useMarketingCenterSections } from 'hooks/use-marketing-center-sections'
import { useMarketingCenterMediums } from 'hooks/use-marketing-center-mediums'

import { getActiveTeamId } from 'utils/user-teams'

import Acl from 'components/Acl'
import PageLayout from 'components/GlobalPageLayout'

import { useTemplatesList } from './hooks/use-templates-list'
import Tabs from './Tabs'

export function MarketingLayout({ params, router, render }) {
  const sections = useMarketingCenterSections(params)
  const user = useSelector(({ user }) => user)

  const templateTypes = params.types

  const activeBrand = getActiveTeamId(user)

  const { templates, loading } = useTemplatesList(activeBrand, templateTypes)
  const mediums = useMarketingCenterMediums(templates)

  const currentMedium = params.medium
  const currentMediumTemplates = templates.filter(item =>
    currentMedium ? item.medium === currentMedium : true
  )

  useEffect(() => {
    if (templateTypes && !currentMedium && mediums.length > 0) {
      router.push(`/dashboard/marketing/${templateTypes}/${mediums[0]}`)
    }
  }, [currentMedium, mediums, router, templateTypes])

  return (
    <Acl.Marketing fallbackUrl="/dashboard/mls">
      <Helmet>
        <title>Marketing | Rechat</title>
      </Helmet>

      <PageLayout>
        <PageLayout.Header title="Marketing Center" />
        <PageLayout.Main>
          <Tabs
            sections={sections}
            mediums={mediums}
            templateTypes={templateTypes}
          />
          {render &&
            render({
              items: currentMediumTemplates,
              isLoading: loading,
              types: params.types,
              medium: params.medium
            })}
        </PageLayout.Main>
      </PageLayout>
    </Acl.Marketing>
  )
}

export default withRouter(MarketingLayout)
