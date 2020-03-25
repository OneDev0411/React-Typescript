import React, { useEffect } from 'react'
import { withRouter } from 'react-router'
import { Helmet } from 'react-helmet'

import { useMarketingCenterSections } from 'hooks/use-marketing-center-sections'
import { useMarketingCenterMediums } from 'hooks/use-marketing-center-mediums'

import { getActiveTeamId } from 'utils/user-teams'

import Acl from 'components/Acl'
import PageLayout from 'components/GlobalPageLayout'
import TemplatesList from 'components/TemplatesList'

import { useTemplatesList } from './hooks/use-templates-list'
import Tabs from './Tabs'

export function Marketing(props) {
  const sections = useMarketingCenterSections(props.params)

  const templateTypes = props.params.types

  const activeBrand = getActiveTeamId(props.user)
  const { templates, loading } = useTemplatesList(activeBrand, templateTypes)
  const mediums = useMarketingCenterMediums(templates)

  const currentMedium = props.params.medium
  const currentMediumTemplates = templates.filter(item =>
    currentMedium ? item.medium === currentMedium : true
  )

  useEffect(() => {
    if (templateTypes && !currentMedium && mediums.length > 0) {
      props.router.push(`/dashboard/marketing/${templateTypes}/${mediums[0]}`)
    }
  }, [currentMedium, mediums, props.router, templateTypes])

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
          <TemplatesList
            items={currentMediumTemplates}
            isLoading={loading}
            type={props.params.types}
            medium={props.params.medium}
          />
        </PageLayout.Main>
      </PageLayout>
    </Acl.Marketing>
  )
}

export default withRouter(Marketing)
