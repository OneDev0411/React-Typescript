import React from 'react'
import {
  Button,
  IconButton,
  Typography,
  Slide,
  makeStyles,
  Theme,
  Box,
  MenuList,
  MenuItem
} from '@material-ui/core'
import pluralize from 'pluralize'
import {
  mdiArrowRight,
  mdiInformationOutline,
  mdiTrashCanOutline
} from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

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
      justifyContent: 'space-between',
      bottom: 0,
      border: `1px solid ${theme.palette.divider}`,
      borderBottom: 'none',
      borderTopLeftRadius: theme.shape.borderRadius,
      borderTopRightRadius: theme.shape.borderRadius,
      background: theme.palette.grey['100'],
      position: 'sticky',
      height: theme.spacing(10),
      width: `calc(100% - ${theme.spacing(10)}px)`,
      margin: theme.spacing(0, 5),
      padding: theme.spacing(0, 1),
      boxShadow: '0px -4px 16px rgba(0, 0, 0, 0.08)',
      zIndex: theme.zIndex.gridAction,
      '& button': {
        marginRight: theme.spacing(1)
      }
    },
    divider: {
      margin: theme.spacing(0, 1)
    },
    title: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer'
    },
    infoIcon: {
      color: theme.palette.secondary.main
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
          <div className={classes.root}>
            <BaseDropdown
              renderDropdownButton={props => (
                <Button
                  {...props}
                  disabled={state.attachments.length === 0}
                  endIcon={
                    <SvgIcon
                      path={mdiInformationOutline}
                      className={classes.infoIcon}
                    />
                  }
                >
                  <Typography variant="subtitle2" className={classes.title}>
                    {pluralize('file', state.attachments.length, true)} selected
                  </Typography>
                </Button>
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
                          onClick={() => handleRemoveAttachment(attachment)}
                        >
                          <SvgIcon
                            path={mdiTrashCanOutline}
                            size={muiIconSizes.small}
                          />
                        </IconButton>
                      </Box>
                    </MenuItem>
                  ))}
                </MenuList>
              )}
            />

            <div>
              <Button
                color="secondary"
                variant="outlined"
                onClick={handleCancel}
              >
                Cancel
              </Button>

              {state.actions.some(id =>
                [DOCUSIGN_FORM, DOCUSIGN_ENVELOPE, DOCUSIGN_FILE].includes(id)
              ) && (
                <Button
                  variant="contained"
                  color="secondary"
                  endIcon={
                    <SvgIcon path={mdiArrowRight} size={muiIconSizes.small} />
                  }
                  onClick={handleOpenDrawer}
                >
                  Next: Docusign
                </Button>
              )}

              {state.actions.some(id =>
                [EMAIL_FILE, EMAIL_ENVELOPE, EMAIL_FORM].includes(id)
              ) && (
                <Button
                  variant="contained"
                  color="secondary"
                  endIcon={
                    <SvgIcon path={mdiArrowRight} size={muiIconSizes.small} />
                  }
                  onClick={handleOpenDrawer}
                >
                  Next: Send Email
                </Button>
              )}
            </div>
          </div>
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
