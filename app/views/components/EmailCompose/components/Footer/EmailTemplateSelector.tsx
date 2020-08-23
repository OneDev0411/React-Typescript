import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import {
  Box,
  Button,
  createStyles,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Theme,
  Tooltip,
  Typography
} from '@material-ui/core'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { mdiPlusCircleOutline, mdiPencilOutline } from '@mdi/js'

import { fetchEmailTemplates } from 'actions/email-templates/fetch-email-templates'
import { getActiveTeamId } from 'utils/user-teams'
import { IAppState } from 'reducers'
import {
  selectEmailTemplates,
  selectEmailTemplatesError,
  selectEmailTemplatesIsFetching
} from 'reducers/email-templates'
import { ServerError } from 'components/ServerError'
import { ListSkeleton } from 'components/Skeletons/List'
import AddOrEditEmailTemplateDrawer from 'components/AddOrEditEmailTemplateDrawer'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { useIconStyles } from '../../../../../styles/use-icon-styles'

import { FooterBottomDrawerZeroState } from './FooterBottomDrawerZeroState'
import { ScrollableArea } from '../../../ScrollableArea'

interface Props {
  onTemplateSelected: (emailTemplate: IBrandEmailTemplate) => void

  // from redux
  templates: IBrandEmailTemplate[]
  error: string
  isFetching: boolean
  brand: string
  fetchEmailTemplates: IAsyncActionProp<typeof fetchEmailTemplates>
}

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      secondaryAction: {
        transition: theme.transitions.create('opacity'),
        opacity: 0
      },
      listItem: {
        '&:hover $secondaryAction': {
          opacity: 1
        }
      }
    }),
  { name: 'EmailTemplateSelector' }
)

function EmailTemplateSelector({
  templates,
  fetchEmailTemplates,
  error,
  isFetching,
  brand,
  onTemplateSelected
}: Props) {
  useEffect(() => {
    brand && fetchEmailTemplates(brand)
  }, [brand, fetchEmailTemplates])

  const classes = useStyles()
  const iconClasses = useIconStyles()
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [
    editingTemplate,
    setEditingTemplate
  ] = useState<IBrandEmailTemplate | null>(null)

  const openNewTemplateDrawer = () => {
    setEditingTemplate(null)
    setDrawerOpen(true)
  }
  const handleEditTemplate = template => {
    setEditingTemplate(template)
    setDrawerOpen(true)
  }

  const templateDrawer = (
    <AddOrEditEmailTemplateDrawer
      isOpen={isDrawerOpen}
      onClose={() => setDrawerOpen(false)}
      emailTemplate={editingTemplate}
      submitCallback={template => onTemplateSelected(template)}
    />
  )

  if (templates.length > 0 || isFetching) {
    const items =
      // Show previously loaded items even while loading new items
      templates.length > 0 ? (
        (templates || []).map(template => {
          const editButton = (
            <ListItemSecondaryAction
              className={classes.secondaryAction}
              onClick={event => event.stopPropagation()}
            >
              <IconButton
                disabled={!template.editable}
                edge="end"
                aria-label="edit"
                onClick={() => handleEditTemplate(template)}
              >
                <SvgIcon path={mdiPencilOutline} />
              </IconButton>
            </ListItemSecondaryAction>
          )

          return (
            <ListItem
              key={template.id}
              classes={{
                // it seems a buggy behavior from MUI, but when the actions
                // are disabled, the list item layout is changed and
                // container class becomes required
                container: classes.listItem,
                root: classes.listItem
              }}
              onClick={() => onTemplateSelected(template)}
              ContainerComponent="div"
              dense
              button
              divider
            >
              <ListItemText
                primary={template.name}
                secondary={template.subject || 'No Subject'}
              />
              {template.editable ? (
                editButton
              ) : (
                <Tooltip
                  placement="left"
                  title={"You can't edit this template"}
                >
                  {editButton}
                </Tooltip>
              )}
            </ListItem>
          )
        })
      ) : (
        /* isFetching === true */
        <ListSkeleton dense twoLines divider numItems={4} />
      )

    return (
      <>
        {templateDrawer}
        <ScrollableArea
          hasThinnerScrollbar
          shadowHeight={20}
          shadowColor="white"
        >
          <List disablePadding>
            <ListItem dense button divider onClick={openNewTemplateDrawer}>
              <ListItemText
                secondary={
                  <Box
                    display="flex"
                    alignItems="center"
                    color="secondary.main"
                  >
                    <SvgIcon
                      path={mdiPlusCircleOutline}
                      className={iconClasses.rightMargin}
                    />
                    <Typography color="secondary">
                      Add a new Email Template
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            {items}
          </List>
        </ScrollableArea>
      </>
    )
  }

  // We intentionally handle error last to prioritize previously fetched
  // items over error in last try for fetching templates, just in case.
  if (error) {
    return <ServerError error={error} />
  }

  return (
    <>
      {templateDrawer}
      <FooterBottomDrawerZeroState
        description="There is no email templates. Save your time by creating Email Template with variables for common emails"
        actions={
          <>
            <Button variant="outlined" onClick={openNewTemplateDrawer}>
              Create an email template
            </Button>
          </>
        }
      />
    </>
  )
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  return {
    fetchEmailTemplates: (...args: Parameters<typeof fetchEmailTemplates>) =>
      dispatch(fetchEmailTemplates(...args))
  }
}

export default connect(({ emailTemplates, user }: IAppState) => {
  const brandId = getActiveTeamId(user) || ''

  return {
    brand: brandId,
    templates: selectEmailTemplates(emailTemplates, brandId),
    isFetching: selectEmailTemplatesIsFetching(emailTemplates, brandId),
    error: selectEmailTemplatesError(emailTemplates, brandId)
  }
}, mapDispatchToProps)(EmailTemplateSelector)
