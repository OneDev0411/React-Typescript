import { useState, useMemo, memo } from 'react'

import { Button, Tooltip, IconButton, makeStyles } from '@material-ui/core'
import { mdiCogOutline, mdiPlus } from '@mdi/js'
import { orderBy } from 'lodash'
import pluralize from 'pluralize'
import { Helmet } from 'react-helmet'
import { withRouter, WithRouterProps } from 'react-router'

import { useActiveTeam } from '@app/hooks/team/use-active-team'
import { useBrandAssets } from '@app/hooks/use-brand-assets'
import { useMarketingCenterMediums } from '@app/hooks/use-marketing-center-mediums'
import { useMarketingCenterSections } from '@app/hooks/use-marketing-center-sections'
import { useMarketingTemplateTypesWithMediums } from '@app/hooks/use-marketing-template-types-with-mediums'
import useNotify from '@app/hooks/use-notify'
import {
  hasUserAccessToBrandSettings,
  hasUserAccessToUploadBrandAssets
} from '@app/utils/acl'
import { goTo } from '@app/utils/go-to'
import {
  isBrandAsset,
  isTemplateInstance
} from '@app/utils/marketing-center/helpers'
import Acl from '@app/views/components/Acl'
import PageLayout from '@app/views/components/GlobalPageLayout'
import MarketingAssetUploadDrawer from '@app/views/components/MarketingAssetUploadDrawer'
import MarketingSearchInput, {
  TemplateTypeWithMedium
} from '@app/views/components/MarketingSearchInput'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { useTemplates } from './hooks/use-templates'
import Tabs from './Tabs'

const useStyles = makeStyles(theme => ({
  headerActionsContainer: {
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'center'
  },
  uploadAssetButtonContainer: {
    marginRight: theme.spacing(2),
    '& svg': {
      marginRight: theme.spacing(1)
    }
  },
  searchContainer: {
    width: 300,
    marginLeft: theme.spacing(2)
  }
}))

interface Props {
  render: (props: {
    items: (IBrandMarketingTemplate | IBrandAsset)[]
    isLoading: boolean
    types: string
    medium: IMarketingTemplateMedium
    defaultSelectedTemplate: Optional<UUID>
    onSelectTemplate: (
      template:
        | IBrandMarketingTemplate
        | IMarketingTemplateInstance
        | IBrandAsset
    ) => void
    onDeleteTemplate: (template: IBrandMarketingTemplate) => void
    onDeleteBrandAsset: (asset: IBrandAsset) => void
    hasDeleteAccessOnBrandAsset: (asset: IBrandAsset) => boolean
  }) => JSX.Element
}

export function MarketingLayout({
  render,
  ...props
}: Props &
  WithRouterProps<
    { types: string; medium: IMarketingTemplateMedium },
    { templateId?: UUID }
  >) {
  const classes = useStyles()
  const activeTeam = useActiveTeam()
  const notify = useNotify()
  const activeBrandId = activeTeam.brand.id
  const [
    isMarketingAssetUploadDrawerOpen,
    setIsMarketingAssetUploadDrawerOpen
  ] = useState<boolean>(false)

  const { params, router, location } = props
  const sections = useMarketingCenterSections(params)

  const templateTypes = params.types

  const {
    templates,
    isLoading: isLoadingTemplates,
    deleteTemplate
  } = useTemplates(activeBrandId)

  const currentMedium = params.medium
  const {
    assets,
    isLoading: isLoadingBrandAssets,
    refetch: refetchBrandAssets,
    delete: deleteBrandAsset,
    hasDeleteAccess: hasDeleteAccessOnBrandAsset
  } = useBrandAssets(activeBrandId)
  const mediums = useMarketingCenterMediums(templates, assets)

  const templateTypesWithMediums = useMarketingTemplateTypesWithMediums(
    templates,
    assets
  )

  const isLoading = isLoadingTemplates || isLoadingBrandAssets

  const currentPageItems = useMemo(() => {
    const splittedTemplateTypes = templateTypes ? templateTypes.split(',') : []

    const currentPageTemplates = templates.filter(item => {
      const mediumMatches = currentMedium
        ? item.template.medium === currentMedium
        : true
      const typeMatches =
        splittedTemplateTypes.length > 0
          ? splittedTemplateTypes.includes(item.template.template_type)
          : true

      return mediumMatches && typeMatches
    })

    const currentPageAssets = assets.filter(item => {
      const mediumMatches = currentMedium
        ? item.medium === currentMedium
        : !!item.medium
      const typeMatches =
        splittedTemplateTypes.length > 0 && item.template_type
          ? splittedTemplateTypes.includes(item.template_type)
          : true

      return mediumMatches && typeMatches
    })

    const currentPageTemplatesAndAssets: Array<
      IBrandMarketingTemplate | IBrandAsset
    > = orderBy(
      [...currentPageTemplates, ...currentPageAssets],
      ['created_at'],
      'desc'
    )

    return currentPageTemplatesAndAssets
  }, [currentMedium, templateTypes, templates, assets])

  const hasAccessToBrandSettings = hasUserAccessToBrandSettings(activeTeam)
  const hasAccessToUploadBrandAssets =
    hasUserAccessToUploadBrandAssets(activeTeam)

  const onSelectTemplate = (
    template: IBrandMarketingTemplate | IMarketingTemplateInstance | IBrandAsset
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

    const templateId = isBrandAsset(template)
      ? template.id
      : (template as IBrandMarketingTemplate | IMarketingTemplateInstance)
          .template.id

    router.replace({
      ...location,
      query: {
        ...newQuery,
        templateId
      }
    })
  }

  const handleSelectSearchResult = (result: TemplateTypeWithMedium) => {
    goTo(
      `/dashboard/marketing/${result.type}${
        result.medium ? `/${result.medium}` : ''
      }`
    )
  }

  const openUploadMarketingAssetDrawer = () => {
    setIsMarketingAssetUploadDrawerOpen(true)
  }

  const closeUploadMarketingAssetDrawer = async (
    uploadedAssets?: IBrandAsset[]
  ) => {
    if (uploadedAssets) {
      notify({
        status: 'success',
        message: `${pluralize(
          'asset',
          uploadedAssets.length,
          true
        )} uploaded successfully`
      })
      refetchBrandAssets()
    }

    setIsMarketingAssetUploadDrawerOpen(false)
  }

  const handleUploadAssetClick = () => {
    openUploadMarketingAssetDrawer()
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
                types={templateTypesWithMediums}
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
            {hasAccessToUploadBrandAssets && (
              <div className={classes.uploadAssetButtonContainer}>
                <Tooltip title="Upload Asset">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUploadAssetClick}
                    startIcon={<SvgIcon path={mdiPlus} />}
                  >
                    Add
                  </Button>
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
              onDeleteTemplate: deleteTemplate,
              onDeleteBrandAsset: deleteBrandAsset,
              hasDeleteAccessOnBrandAsset
            })}
          {isMarketingAssetUploadDrawerOpen && (
            <MarketingAssetUploadDrawer
              defaultSelectedTemplateType={
                templateTypes
                  ? (templateTypes.split(',')[0] as IMarketingTemplateType)
                  : undefined
              }
              defaultSelectedMedium={currentMedium}
              onClose={closeUploadMarketingAssetDrawer}
            />
          )}
        </PageLayout.Main>
      </PageLayout>
    </Acl.Marketing>
  )
}

export default withRouter(memo(MarketingLayout))
