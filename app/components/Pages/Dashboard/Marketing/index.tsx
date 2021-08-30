import { useMemo, memo } from 'react'

import { Tooltip, IconButton, makeStyles } from '@material-ui/core'
import { mdiCogOutline } from '@mdi/js'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { withRouter, WithRouterProps } from 'react-router'

import { selectActiveTeamId } from '@app/selectors/team'
import MarketingSearchInput, {
  MarketingSearchInputOption
} from '@app/views/components/MarketingSearchInput'
import Acl from 'components/Acl'
import PageLayout from 'components/GlobalPageLayout'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { useMarketingCenterMediums } from 'hooks/use-marketing-center-mediums'
import { useMarketingCenterSections } from 'hooks/use-marketing-center-sections'
import { selectUser } from 'selectors/user'
import { goTo } from 'utils/go-to'
import { isTemplateInstance } from 'utils/marketing-center/helpers'
import { hasUserAccessToBrandSettings } from 'utils/user-teams'

import { useTemplates } from './hooks/use-templates'
import Tabs from './Tabs'

const useStyles = makeStyles(theme => ({
  headerActionsContainer: {
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'center'
  },
  searchContainer: {
    width: 300,
    marginLeft: theme.spacing(2)
  }
}))

interface Props {
  render: (props: {
    items: IBrandMarketingTemplate[]
    isLoading: boolean
    types: string
    medium: IMarketingTemplateMedium
    defaultSelectedTemplate: UUID
    onSelectTemplate: (template: IBrandMarketingTemplate) => void
    onDeleteTemplate: (template: IBrandMarketingTemplate) => void
  }) => JSX.Element
}

export function MarketingLayout({
  render,
  ...props
}: Props &
  WithRouterProps<{ types: string; medium: IMarketingTemplateMedium }>) {
  const classes = useStyles()
  const activeBrand = useSelector(selectActiveTeamId)
  const user = useSelector(selectUser)

  const { params, router, location } = props
  const sections = useMarketingCenterSections(params)

  const templateTypes = params.types

  const { templates, isLoading, deleteTemplate } = useTemplates(activeBrand)
  const mediums = useMarketingCenterMediums(templates)

  const currentMedium = params.medium
  const currentPageItems = useMemo(() => {
    const splittedTemplateTypes = templateTypes ? templateTypes.split(',') : []

    return templates.filter(item => {
      const mediumMatches = currentMedium
        ? item.template.medium === currentMedium
        : true
      const typeMatches =
        splittedTemplateTypes.length > 0
          ? splittedTemplateTypes.includes(item.template.template_type)
          : true

      return mediumMatches && typeMatches
    })
  }, [currentMedium, templateTypes, templates])

  const hasAccessToBrandSettings = hasUserAccessToBrandSettings(user)

  const onSelectTemplate = (
    template: IBrandMarketingTemplate | IMarketingTemplateInstance
  ) => {
    const newQuery = { ...location.query }

    if (!template || (template && isTemplateInstance(template))) {
      delete newQuery.templateId

      router.replace({
        ...location,
        query: newQuery
      })

      return
    }

    router.replace({
      ...location,
      query: {
        ...newQuery,
        templateId: template.id
      }
    })
  }

  const handleSelectSearchResult = (result: MarketingSearchInputOption) => {
    goTo(result.url)
  }

  return (
    <Acl.Marketing fallbackUrl="/dashboard/mls">
      <Helmet>
        <title>Marketing | Rechat</title>
      </Helmet>

      <PageLayout position="relative" overflow="hidden">
        <PageLayout.Header title="Marketing Center">
          <div className={classes.headerActionsContainer}>
            <div className={classes.searchContainer}>
              <MarketingSearchInput
                sections={sections}
                templateTypeMediums={mediums}
                onSelect={handleSelectSearchResult}
              />
            </div>
            {hasAccessToBrandSettings && (
              <div>
                <Tooltip title="Brand Setup">
                  <IconButton onClick={() => goTo('/dashboard/brand-settings')}>
                    <SvgIcon path={mdiCogOutline} />
                  </IconButton>
                </Tooltip>
              </div>
            )}
          </div>
        </PageLayout.Header>
        <PageLayout.Main minHeight="100vh">
          <Tabs
            sections={sections}
            mediums={mediums}
            templateTypes={templateTypes}
            isOverviewActive={location.pathname === '/dashboard/marketing'}
            isMyDesignsActive={
              location.pathname === '/dashboard/marketing/designs'
            }
          />
          {render &&
            render({
              items: currentPageItems,
              isLoading,
              types: params.types,
              medium: params.medium,
              onSelectTemplate,
              defaultSelectedTemplate: location.query.templateId,
              onDeleteTemplate: deleteTemplate
            })}
        </PageLayout.Main>
      </PageLayout>
    </Acl.Marketing>
  )
}

export default withRouter(memo(MarketingLayout))
