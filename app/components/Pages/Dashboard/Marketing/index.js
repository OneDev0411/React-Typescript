import React from 'react'
import { useSelector } from 'react-redux'
import { withRouter } from 'react-router'
import { Helmet } from 'react-helmet'
import { Tooltip, IconButton, makeStyles } from '@material-ui/core'
import { mdiCogOutline } from '@mdi/js'

import { useMarketingCenterSections } from 'hooks/use-marketing-center-sections'
import { useMarketingCenterMediums } from 'hooks/use-marketing-center-mediums'
import { getActiveTeamId, hasUserAccessToBrandSettings } from 'utils/user-teams'
import { goTo } from 'utils/go-to'
import { selectUser } from 'selectors/user'

import Acl from 'components/Acl'
import PageLayout from 'components/GlobalPageLayout'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { useTemplates } from './hooks/use-templates'
import Tabs from './Tabs'

const useStyles = makeStyles(() => ({
  headerActionsContainer: {
    display: 'flex',
    flexDirection: 'row-reverse'
  }
}))

export function MarketingLayout({ render, ...props }) {
  const classes = useStyles()
  const { params, router } = props
  const sections = useMarketingCenterSections(params)
  const user = useSelector(state => selectUser(state))

  const templateTypes = params.types

  const activeBrand = getActiveTeamId(user)
  const hasAccessToBrandSettings = hasUserAccessToBrandSettings(user)

  const { templates, isLoading, deleteTemplate } = useTemplates(activeBrand)
  const mediums = useMarketingCenterMediums(templates)

  const splittedTemplateTypes = templateTypes ? templateTypes.split(',') : []

  const currentMedium = params.medium
  const currentPageItems = templates.filter(item => {
    const mediumMatches = currentMedium
      ? item.template.medium === currentMedium
      : true
    const typeMatches =
      splittedTemplateTypes.length > 0
        ? splittedTemplateTypes.includes(item.template.template_type)
        : true

    return mediumMatches && typeMatches
  })

  return (
    <Acl.Marketing fallbackUrl="/dashboard/mls">
      <Helmet>
        <title>Marketing | Rechat</title>
      </Helmet>

      <PageLayout position="relative" overflow="hidden">
        <PageLayout.Header title="Marketing Center">
          {hasAccessToBrandSettings && (
            <div className={classes.headerActionsContainer}>
              <Tooltip title="Brand Setup">
                <IconButton onClick={() => goTo('/dashboard/brand-settings')}>
                  <SvgIcon path={mdiCogOutline} />
                </IconButton>
              </Tooltip>
            </div>
          )}
        </PageLayout.Header>
        <PageLayout.Main>
          <Tabs
            sections={sections}
            mediums={mediums}
            templateTypes={templateTypes}
            isOverviewActive={
              router.location.pathname === '/dashboard/marketing'
            }
            isMyDesignsActive={
              router.location.pathname === '/dashboard/marketing/designs'
            }
          />
          {render &&
            render({
              items: currentPageItems,
              isLoading,
              types: params.types,
              medium: params.medium,
              onDeleteTemplate: deleteTemplate
            })}
        </PageLayout.Main>
      </PageLayout>
    </Acl.Marketing>
  )
}

export default withRouter(MarketingLayout)
