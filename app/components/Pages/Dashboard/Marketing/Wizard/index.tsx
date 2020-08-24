import React, { useState } from 'react'
import fileSaver from 'file-saver'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter, WithRouterProps } from 'react-router'
import { useTitle } from 'react-use'
import { addNotification } from 'reapop'
import {
  makeStyles,
  Theme,
  AppBar,
  Toolbar,
  Grid,
  Paper,
  Box,
  Typography,
  Hidden,
  Button,
  CircularProgress
} from '@material-ui/core'
import { mdiPencilOutline } from '@mdi/js'

import { IAppState } from 'reducers'
import { useListingById } from 'hooks/use-query-param-entities'
import { useInfiniteScroll } from 'hooks/use-infinite-scroll'
import { getActiveTeamId, getActiveBrand } from 'utils/user-teams'
import { useUniqueTemplateTypes } from 'hooks/use-unique-template-types'

import { SideNavToggleButton } from 'components/SideNavToggleButton'
import { Thumbnail } from 'components/MarketingTemplateCard/Thumbnail'
import PageLayout from 'components/GlobalPageLayout'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { createTemplateInstance } from 'models/instant-marketing/create-template-instance'

import renderBrandedTemplate from 'utils/marketing-center/render-branded-template'

import { useTemplates } from '../hooks/use-templates'

import { LISTING_TEMPLATE_TYPES, TEMPLATES_PAGE_SIZE } from './constants'
import CategoriesTabs from './CategoriesTabs'
import ShareDrawer from './ShareDrawer'
import EditVariablesDialog from './EditVariablesDialog'
import { getEditableVariablesSections } from './helpers'
import { useEntityWithSetter } from './hooks'
import { TemplateVariable } from './types'

const useStyles = makeStyles((theme: Theme) => ({
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
    flexGrow: 1,
    textAlign: 'center'
  },
  thumbnailPaper: {
    overflow: 'hidden'
  }
}))

function MarketingWizard(props: WithRouterProps) {
  useTitle('Marketing | Rechat')

  const classes = useStyles()

  const dispatch = useDispatch()
  const rawUser = useSelector<IAppState, IUser>(({ user }) => user)
  const activeBrand = getActiveTeamId(rawUser)
  const brand = getActiveBrand(rawUser)

  const [selectedTemplate, setSelectedTemplate] = useState<
    Nullable<IBrandMarketingTemplate>
  >(null)

  const [selectedTemplateType, setSelectedTemplateType] = useState<
    Optional<string>
  >(undefined)

  const [templatesLimit, setTemplatesLimit] = useState<number>(
    TEMPLATES_PAGE_SIZE
  )

  const [isEditVariablesDialogOpen, setIsEditVariablesDialogOpen] = useState<
    boolean
  >(false)

  const {
    templates,
    isLoading: isLoadingTemplates,
    error: errorTemplates
  } = useTemplates(activeBrand, ['Social'], LISTING_TEMPLATE_TYPES)

  const {
    listing: rawListing,
    isLoading: isLoadingListing,
    error: errorListing
  } = useListingById(props.location)

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

  const variablesSections = getEditableVariablesSections(templates, {
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

  const handleOpenShareDrawer = (template: IBrandMarketingTemplate) => {
    setSelectedTemplate(template)
  }
  const handleCloseShareDrawer = () => setSelectedTemplate(null)

  const handleOpenEditVariablesDialog = () => {
    setIsEditVariablesDialogOpen(true)
  }
  const handleCloseEditVariablesDialog = () =>
    setIsEditVariablesDialogOpen(false)

  const handleSaveVariables = (newVariables: TemplateVariable[]) => {
    setTemplateVariables(newVariables)
    handleCloseEditVariablesDialog()
  }

  const handleDownloadClick = async (template: IBrandMarketingTemplate) => {
    if (!listing || !brand) {
      return
    }

    try {
      const html = await renderBrandedTemplate(template, brand, {
        listing
      })

      const templateInstance = await createTemplateInstance(
        template.template.id,
        {
          html,
          listings: [listing.id]
        }
      )

      dispatch(
        addNotification({
          status: 'success',
          message:
            'Marketing peace created successfully! You should be prompet to download file in a few seconds!'
        })
      )

      fileSaver.saveAs(
        templateInstance.file.url,
        `listing-${listing.mls_number}.${
          templateInstance.file.name.split('.')[1]
        }`
      )
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
        <Grid container item justify="center">
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
    <PageLayout gutter={0} className={classes.container}>
      <Hidden smUp implementation="css">
        <AppBar
          position="static"
          color="transparent"
          elevation={0}
          className={classes.appBar}
        >
          <Toolbar disableGutters className={classes.toolbar}>
            <SideNavToggleButton />
            <Typography
              variant="h6"
              color="textPrimary"
              noWrap
              className={classes.title}
            >
              Browse Templates
            </Typography>
            <Button onClick={handleOpenEditVariablesDialog}>
              <SvgIcon path={mdiPencilOutline} />
            </Button>
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
      </Hidden>
      <PageLayout.Main mt={1}>
        <Grid container spacing={2} className={classes.container}>
          <Grid container item>
            {currentTabTemplates.slice(0, templatesLimit).map(template => (
              <Grid
                key={template.id}
                container
                item
                justify="center"
                xs={6}
                lg={4}
              >
                <Box my={2} mx={1}>
                  <Paper
                    elevation={12}
                    variant="elevation"
                    className={classes.thumbnailPaper}
                  >
                    <Thumbnail
                      user={user}
                      listing={listing!}
                      template={template}
                      onClick={() => handleOpenShareDrawer(template)}
                    />
                  </Paper>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </PageLayout.Main>

      {listing && selectedTemplate && (
        <ShareDrawer
          isOpen
          template={selectedTemplate}
          listing={listing}
          user={user}
          onClose={handleCloseShareDrawer}
          onDownloadClick={() => handleDownloadClick(selectedTemplate)}
        />
      )}
      {isEditVariablesDialogOpen && (
        <EditVariablesDialog
          sections={variablesSections}
          onClose={handleCloseEditVariablesDialog}
          onSave={handleSaveVariables}
        />
      )}
    </PageLayout>
  )
}

export default withRouter(MarketingWizard)
