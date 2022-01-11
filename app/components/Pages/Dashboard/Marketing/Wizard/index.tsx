import { useState, useEffect } from 'react'

import {
  makeStyles,
  useMediaQuery,
  Theme,
  AppBar,
  Toolbar,
  Tooltip,
  Grid,
  Paper,
  Box,
  Typography,
  CircularProgress,
  IconButton
} from '@material-ui/core'
import { mdiPencilOutline } from '@mdi/js'
import fileSaver from 'file-saver'
import { isDesktop } from 'react-device-detect'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter, WithRouterProps } from 'react-router'
import { useTitle } from 'react-use'

import { useActiveBrandId } from '@app/hooks/brand/use-active-brand-id'
import { useUnsafeActiveBrand } from '@app/hooks/brand/use-unsafe-active-brand'
import PageLayout from 'components/GlobalPageLayout'
import { Thumbnail } from 'components/MarketingTemplateCard/Thumbnail'
import { addNotification } from 'components/notification'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { useGoogleMapsPlaces } from 'hooks/use-google-maps-places'
import { useInfiniteScroll } from 'hooks/use-infinite-scroll'
import {
  useListingById,
  LISTING_ID_QUERY_KEY
} from 'hooks/use-query-param-entities'
import { useUniqueTemplateTypes } from 'hooks/use-unique-template-types'
import { useWebShareApi } from 'hooks/use-web-share-api'
import { createTemplateInstance } from 'models/instant-marketing/create-template-instance'
import { uploadAsset } from 'models/instant-marketing/upload-asset'
import { selectUser } from 'selectors/user'
import { convertUrlToImageFile } from 'utils/file-utils/convert-url-to-image-file'
import renderBrandedTemplate from 'utils/marketing-center/render-branded-template'

import { useTemplates } from '../hooks/use-templates'

import CategoriesTabs from './CategoriesTabs'
import { LISTING_TEMPLATE_TYPES, TEMPLATES_PAGE_SIZE } from './constants'
import DownloadDrawer from './DownloadDrawer'
import EditVariablesDialog from './EditVariablesDialog'
import { getEditableVariables } from './helpers'
import { useEntityWithSetter } from './hooks'
import PreviewAndDownloadModal from './PreviewAndDownloadModal'
import PreviewDrawer from './PreviewDrawer'
import { TemplateVariable, TemplateVariableType } from './types'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      overflow: 'hidden'
    },
    loadingContainer: {
      height: '100vh'
    },
    appBar: {
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    toolbar: {
      justifyContent: 'space-between'
    },
    title: {
      padding: theme.spacing(0, 2)
    },
    thumbnailPaper: {
      overflow: 'hidden',
      border: 'none'
    }
  }),
  {
    name: 'MarketingWizard'
  }
)

function MarketingWizard(props: WithRouterProps) {
  useTitle('Marketing | Rechat')

  const classes = useStyles()
  const isMobileView = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('xs')
  )

  useEffect(() => {
    const listingId = props.location.query[LISTING_ID_QUERY_KEY]

    if (isDesktop && listingId) {
      props.router.replace(`/dashboard/marketing/mls/${listingId}`)
    }
  }, [props.location.query, props.router])

  useGoogleMapsPlaces()

  const dispatch = useDispatch()
  const rawUser = useSelector(selectUser)
  const activeBrandId = useActiveBrandId()

  const activeBrand = useUnsafeActiveBrand()

  const [selectedTemplate, setSelectedTemplate] =
    useState<Nullable<IBrandMarketingTemplate>>(null)

  const [selectedTemplateType, setSelectedTemplateType] =
    useState<Optional<IMarketingTemplateType>>(undefined)

  const [generatedTemplateFile, setGeneratedTemplateFile] =
    useState<Optional<IFile>>(undefined)

  const [generatedFileBlob, setGeneratedFileBlob] =
    useState<Optional<File>>(undefined)

  const [templatesLimit, setTemplatesLimit] =
    useState<number>(TEMPLATES_PAGE_SIZE)

  const [isEditVariablesDialogOpen, setIsEditVariablesDialogOpen] =
    useState<boolean>(false)

  const {
    templates,
    isLoading: isLoadingTemplates,
    error: errorTemplates
  } = useTemplates(activeBrandId, ['Social'], LISTING_TEMPLATE_TYPES)

  const {
    listing: rawListing,
    isLoading: isLoadingListing,
    error: errorListing
  } = useListingById()

  const [{ user, listing }, setTemplateVariables] = useEntityWithSetter<{
    user: IUser
    listing: Nullable<IListing>
  }>({
    listing: rawListing,
    user: rawUser
  })

  const templateTypes = useUniqueTemplateTypes(templates)

  const currentTabTemplates = templates.filter(
    template =>
      template.template.template_type ===
      (selectedTemplateType ?? templateTypes[0])
  )

  const editableVariables = getEditableVariables(templates, {
    user,
    listing
  })

  const loadMoreTemplates = () => {
    if (templatesLimit <= currentTabTemplates.length) {
      return
    }

    setTemplatesLimit(templatesLimit + TEMPLATES_PAGE_SIZE)
  }

  useInfiniteScroll({
    accuracy: window.innerHeight / 2,
    onScrollBottom: loadMoreTemplates
  })

  useEffect(() => {
    async function setFileBlob() {
      if (!generatedTemplateFile) {
        setGeneratedFileBlob(undefined)

        return
      }

      const file = await convertUrlToImageFile(generatedTemplateFile.url)

      setGeneratedFileBlob(file)
    }

    setFileBlob()
  }, [generatedTemplateFile])

  const { canShare, share } = useWebShareApi({
    files: generatedFileBlob ? [generatedFileBlob] : undefined
  })

  const handleOpenPreviewDrawer = (template: IBrandMarketingTemplate) => {
    setSelectedTemplate(template)
  }

  const handleClosePreviewDrawer = () => {
    setSelectedTemplate(null)
  }

  const handleOpenDownloadDrawer = (file: IFile) => {
    setGeneratedTemplateFile(file)
  }

  const handleCloseDownloadDrawer = () => {
    setGeneratedTemplateFile(undefined)
  }

  const handleOpenEditVariablesDialog = () => {
    setIsEditVariablesDialogOpen(true)
  }

  const handleCloseEditVariablesDialog = () =>
    setIsEditVariablesDialogOpen(false)

  const handleSaveVariables = (
    newVariables: TemplateVariable<TemplateVariableType>[]
  ) => {
    setTemplateVariables(newVariables)
    handleCloseEditVariablesDialog()
  }

  const handleUploadAsset = (file: File) => {
    return uploadAsset(currentTabTemplates[0].template.id, file)
  }

  const handlePrepareClick = async (template: IBrandMarketingTemplate) => {
    if (!listing || !activeBrand) {
      return
    }

    try {
      const html = await renderBrandedTemplate(template, activeBrand, {
        listing
      })

      const templateInstance = await createTemplateInstance(
        template.template.id,
        {
          html,
          listings: [listing.id]
        }
      )

      handleClosePreviewDrawer()

      if (isMobileView) {
        handleOpenDownloadDrawer(templateInstance.file)

        return
      }

      fileSaver.saveAs(templateInstance.file.url, templateInstance.file.name)
    } catch (err) {
      dispatch(
        addNotification({
          status: 'error',
          message: 'Something went wrong. Please try again.'
        })
      )
      console.error(err)
    }
  }

  if (isLoadingTemplates || isLoadingListing) {
    return (
      <Grid container alignItems="center" className={classes.loadingContainer}>
        <Grid container item justifyContent="center">
          <CircularProgress />
        </Grid>
      </Grid>
    )
  }

  if (errorTemplates || errorListing) {
    return (
      <div>
        <div>{errorTemplates}</div>
        <div>{errorListing}</div>
      </div>
    )
  }

  return (
    <PageLayout
      gutter={isMobileView ? 0 : undefined}
      className={classes.container}
    >
      {isMobileView && (
        <AppBar
          position="static"
          color="transparent"
          elevation={0}
          className={classes.appBar}
        >
          <Toolbar disableGutters className={classes.toolbar}>
            <Typography
              variant="h6"
              color="textPrimary"
              noWrap
              className={classes.title}
            >
              Browse Templates
            </Typography>
            <IconButton onClick={handleOpenEditVariablesDialog}>
              <SvgIcon path={mdiPencilOutline} />
            </IconButton>
          </Toolbar>
          <CategoriesTabs
            types={templateTypes}
            selectedType={selectedTemplateType}
            onChange={selected => {
              setTemplatesLimit(TEMPLATES_PAGE_SIZE)
              setSelectedTemplateType(selected)
            }}
          />
        </AppBar>
      )}
      {!isMobileView && (
        <PageLayout.Header title="Browse Templates">
          <div>
            <Tooltip title="Edit Info">
              <IconButton onClick={handleOpenEditVariablesDialog}>
                <SvgIcon path={mdiPencilOutline} />
              </IconButton>
            </Tooltip>
          </div>
        </PageLayout.Header>
      )}
      <PageLayout.Main mt={1}>
        <Grid container spacing={2} className={classes.container}>
          {!isMobileView && (
            <Grid container item>
              <Box mt={2}>
                <CategoriesTabs
                  types={templateTypes}
                  selectedType={selectedTemplateType}
                  onChange={selected => {
                    setTemplatesLimit(TEMPLATES_PAGE_SIZE)
                    setSelectedTemplateType(selected)
                  }}
                />
              </Box>
            </Grid>
          )}
          <Grid container item>
            {currentTabTemplates.slice(0, templatesLimit).map(template => (
              <Grid
                key={template.id}
                container
                item
                justifyContent="center"
                xs={6}
                lg={3}
              >
                <Box p={2} width="100%">
                  <Paper variant="outlined" className={classes.thumbnailPaper}>
                    <Thumbnail
                      user={user}
                      listing={listing!}
                      template={template}
                      onClick={() => handleOpenPreviewDrawer(template)}
                    />
                  </Paper>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </PageLayout.Main>

      {listing &&
        selectedTemplate &&
        (isMobileView ? (
          <PreviewDrawer
            template={selectedTemplate}
            listing={listing}
            user={user}
            onClose={handleClosePreviewDrawer}
            onPrepareClick={() => handlePrepareClick(selectedTemplate)}
          />
        ) : (
          <PreviewAndDownloadModal
            template={selectedTemplate}
            listing={listing}
            user={user}
            onClose={handleClosePreviewDrawer}
            onPrepareClick={() => handlePrepareClick(selectedTemplate)}
          />
        ))}
      {isEditVariablesDialogOpen && (
        <EditVariablesDialog
          variables={editableVariables}
          onClose={handleCloseEditVariablesDialog}
          onUpload={handleUploadAsset}
          onSave={handleSaveVariables}
        />
      )}
      {generatedTemplateFile && isMobileView && (
        <DownloadDrawer
          file={generatedTemplateFile}
          onClose={handleCloseDownloadDrawer}
          onShare={canShare ? share : undefined}
        />
      )}
    </PageLayout>
  )
}

export default withRouter(MarketingWizard)
