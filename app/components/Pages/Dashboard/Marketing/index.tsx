import { useState, useMemo, memo } from 'react'

import { Button, Tooltip, IconButton, makeStyles } from '@material-ui/core'
import { mdiCogOutline, mdiPlus } from '@mdi/js'
import { orderBy } from 'lodash'
import pluralize from 'pluralize'
import { Helmet } from 'react-helmet'
import { withRouter, WithRouterProps } from 'react-router'

import { useActiveTeam } from '@app/hooks/team/use-active-team'
import { useBrandAssets } from '@app/hooks/use-brand-assets'
import { useMarketingCenterCategories } from '@app/hooks/use-marketing-center-categories'
import { useMarketingCenterSections } from '@app/hooks/use-marketing-center-sections'
import { useMarketingTemplateTypesWithMediums } from '@app/hooks/use-marketing-template-types-with-mediums'
import useNotify from '@app/hooks/use-notify'
import { useReplaceQueryParam } from '@app/hooks/use-query-param'
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

  const { params, location } = props
  const sections = useMarketingCenterSections(params)

  const templateTypes = useMemo(() => {
    return (
      params.types ? params.types.split(',') : []
    ) as IMarketingTemplateType[]
  }, [params.types])

  const currentMedium = params.medium

  const shouldFetchTemplatesAndAssets =
    !!currentMedium || !!templateTypes.length
  const [, setTemplateIdQueryParam, removeTemplateIdQueryParam] =
    useReplaceQueryParam('templateId')

  const {
    templates,
    isLoading: isLoadingTemplates,
    deleteTemplate
  } = useTemplates(
    activeBrandId,
    [currentMedium],
    templateTypes,
    shouldFetchTemplatesAndAssets
  )

  const {
    assets,
    isLoading: isLoadingBrandAssets,
    refetch: refetchBrandAssets,
    delete: deleteBrandAsset,
    hasDeleteAccess: hasDeleteAccessOnBrandAsset
  } = useBrandAssets(
    activeBrandId,
    {
      mediums: [currentMedium],
      templateTypes
    },
    shouldFetchTemplatesAndAssets
  )
  const {
    categories,
    isLoading: isLoadingCategories,
    refetch: refetchCategories
  } = useMarketingCenterCategories(activeBrandId)

  const templateTypesWithMediums =
    useMarketingTemplateTypesWithMediums(categories)

  const isLoading = isLoadingTemplates || isLoadingBrandAssets

  const currentPageItems = useMemo(() => {
    const currentPageTemplatesAndAssets: Array<
      IBrandMarketingTemplate | IBrandAsset
    > = orderBy([...templates, ...assets], ['created_at'], 'desc')

    return currentPageTemplatesAndAssets
  }, [templates, assets])

  const hasAccessToBrandSettings = hasUserAccessToBrandSettings(activeTeam)
  const hasAccessToUploadBrandAssets =
    hasUserAccessToUploadBrandAssets(activeTeam)

  const onSelectTemplate = (
    template: IBrandMarketingTemplate | IMarketingTemplateInstance | IBrandAsset
  ) => {
    if (!template || (template && isTemplateInstance(template))) {
      removeTemplateIdQueryParam()

      return
    }

    const templateId = isBrandAsset(template)
      ? template.id
      : (template as IBrandMarketingTemplate | IMarketingTemplateInstance)
          .template.id

    setTemplateIdQueryParam(templateId)
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
      refetchCategories()
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
            categories={categories}
            templateTypes={params.types}
            isLoading={isLoadingCategories}
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
                templateTypes.length ? templateTypes[0] : undefined
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
