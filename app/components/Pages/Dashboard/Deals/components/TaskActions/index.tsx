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
import { mdiHelpCircleOutline, mdiTrashCanOutline } from '@mdi/js'

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
      justifyContent: 'flex-start',
      bottom: 0,
      borderTop: `1px solid ${theme.palette.divider}`,
      background: theme.palette.common.white,
      position: 'sticky',
      height: theme.spacing(10),
      width: '100%',
      padding: theme.spacing(0, 5),
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
            {state.actions.some(id =>
              [DOCUSIGN_FORM, DOCUSIGN_ENVELOPE, DOCUSIGN_FILE].includes(id)
            ) && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleOpenDrawer}
              >
                Docusign
              </Button>
            )}

            {state.actions.some(id =>
              [EMAIL_FILE, EMAIL_ENVELOPE, EMAIL_FORM].includes(id)
            ) && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleOpenDrawer}
              >
                Send Email
              </Button>
            )}

            <BaseDropdown
              renderDropdownButton={props => (
                <Button {...props} disabled={state.attachments.length === 0}>
                  <Typography variant="body1" className={classes.title}>
                    {pluralize('file', state.attachments.length, true)} selected
                    &nbsp;
                    <SvgIcon
                      path={mdiHelpCircleOutline}
                      size={muiIconSizes.small}
                    />
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
                          <SvgIcon path={mdiTrashCanOutline} />
                        </IconButton>
                      </Box>
                    </MenuItem>
                  ))}
                </MenuList>
              )}
            />

            <Button color="secondary" onClick={handleCancel}>
              Cancel
            </Button>
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
