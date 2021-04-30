import React from 'react'
import {
  Box,
  fade,
  Slide,
  Theme,
  MenuItem,
  MenuList,
  IconButton,
  Typography,
  makeStyles
} from '@material-ui/core'
import {
  mdiClose,
  mdiEmailOutline,
  mdiTrashCanOutline,
  mdiPencilOutline
} from '@mdi/js'

import { GridActionButton } from 'components/Grid/Table/features/Actions/Button'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { BaseDropdown } from 'components/BaseDropdown'
import { TextMiddleTruncate } from 'components/TextMiddleTruncate'
import {
  EmailFormValues,
  SingleEmailComposeDrawer
} from 'components/EmailCompose'

import { useIconStyles } from 'views/../styles/use-icon-styles'

import {
  DOCUSIGN_ENVELOPE,
  DOCUSIGN_FILE,
  DOCUSIGN_FORM,
  EMAIL_ENVELOPE,
  EMAIL_FILE,
  EMAIL_FORM
} from 'deals/components/ActionsButton/data/action-buttons'

import {
  CANCEL,
  REMOVE_ATTACHMENT,
  SET_DRAWER_STATUS,
  SET_FORM_META
} from '../../contexts/actions-context/constants'
import { useChecklistActionsContext } from '../../contexts/actions-context/hooks'

import GetSignature from '../../Signature'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      width: '95%',
      height: theme.spacing(10),
      margin: 'auto',
      position: 'sticky',
      bottom: `${theme.spacing(3)}px`,
      padding: theme.spacing(0, 2),
      background: theme.palette.tertiary.main,
      borderRadius: `${theme.spacing(2)}px`,
      boxShadow: `0 ${theme.spacing(0.5)}px ${theme.spacing(2)}px ${fade(
        theme.palette.common.black,
        0.4
      )}`,
      zIndex: theme.zIndex.gridAction
    },
    divider: {
      margin: theme.spacing(0, 1)
    },
    title: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer'
    },
    selectedCount: {
      color: theme.palette.background.paper
    },
    summary: {
      display: 'flex'
    },
    reviewSelection: {
      marginLeft: theme.spacing(1),
      color: theme.palette.secondary.main,
      cursor: 'pointer'
    }
  }),
  {
    name: 'DealActionsBar'
  }
)

interface Props {
  deal: IDeal
}

export function TaskActions({ deal }: Props) {
  const classes = useStyles()
  const iconClasses = useIconStyles()
  const [state, dispatch] = useChecklistActionsContext()

  const handleCancel = () => {
    dispatch({
      type: CANCEL
    })
  }

  const handleRemoveAttachment = (attachment: IDealFile) => {
    dispatch({
      type: REMOVE_ATTACHMENT,
      attachment
    })
  }

  const handleOpenDrawer = () => {
    dispatch({
      type: SET_DRAWER_STATUS,
      isDrawerOpen: true
    })
  }

  const handleCloseDrawer = () => {
    dispatch({
      type: SET_DRAWER_STATUS,
      isDrawerOpen: false
    })
  }

  const handleClickAddDealAttachments = (formValues: EmailFormValues) => {
    dispatch({
      type: SET_FORM_META,
      form: formValues
    })
    handleCloseDrawer()
  }

  return (
    <>
      {state.actions.length > 0 && !state.isDrawerOpen && (
        <Slide in direction="up">
          <Box className={classes.root}>
            <GridActionButton
              label="Cancel"
              icon={mdiClose}
              onClick={handleCancel}
            />
            <GridActionButton
              label={
                <Box className={classes.summary}>
                  <span>File Selected</span>
                  <BaseDropdown
                    renderDropdownButton={props => (
                      <span
                        ref={props.ref}
                        onClick={props.onClick}
                        className={classes.reviewSelection}
                      >
                        View
                      </span>
                    )}
                    renderMenu={() => (
                      <MenuList>
                        {state.attachments.map((attachment, index) => (
                          <MenuItem key={index}>
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="space-between"
                              style={{ width: '100%' }}
                            >
                              <Box flex={9}>
                                <a href={attachment.url} target="_blank">
                                  <TextMiddleTruncate
                                    text={attachment.name}
                                    maxLength={50}
                                  />
                                </a>
                              </Box>

                              <IconButton
                                edge="end"
                                aria-label="delete"
                                size="small"
                                className={iconClasses.leftMargin}
                                onClick={() =>
                                  handleRemoveAttachment(attachment)
                                }
                              >
                                <SvgIcon path={mdiTrashCanOutline} />
                              </IconButton>
                            </Box>
                          </MenuItem>
                        ))}
                      </MenuList>
                    )}
                  />
                </Box>
              }
              textIcon={
                <Typography variant="h6" className={classes.selectedCount}>
                  {state.attachments.length}
                </Typography>
              }
            />
            {state.actions.some(id =>
              [DOCUSIGN_FORM, DOCUSIGN_ENVELOPE, DOCUSIGN_FILE].includes(id)
            ) && (
              <GridActionButton
                label="Docusign"
                icon={mdiPencilOutline}
                onClick={handleOpenDrawer}
              />
            )}

            {state.actions.some(id =>
              [EMAIL_FILE, EMAIL_ENVELOPE, EMAIL_FORM].includes(id)
            ) && (
              <GridActionButton
                label="Email"
                icon={mdiEmailOutline}
                onClick={handleOpenDrawer}
              />
            )}
          </Box>
        </Slide>
      )}

      <SingleEmailComposeDrawer
        isOpen={
          state.isDrawerOpen &&
          state.actions.some(id =>
            [EMAIL_FORM, EMAIL_ENVELOPE, EMAIL_FORM].includes(id)
          )
        }
        initialValues={{
          attachments: state.attachments,
          ...(state.form || {})
        }}
        deal={deal}
        onClickAddDealAttachments={handleClickAddDealAttachments}
        onClose={handleCancel}
        onSent={handleCancel}
      />

      <GetSignature
        deal={deal}
        isOpen={
          state.isDrawerOpen &&
          state.actions.some(id =>
            [DOCUSIGN_FORM, DOCUSIGN_ENVELOPE, DOCUSIGN_FILE].includes(id)
          )
        }
        defaultAttachments={state.attachments}
        onClickAddAttachments={handleCloseDrawer}
        onClose={handleCancel}
      />
    </>
  )
}
