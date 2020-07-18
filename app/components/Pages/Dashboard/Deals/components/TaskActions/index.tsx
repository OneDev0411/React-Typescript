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

import { useSelector } from 'react-redux'

import QuestionCircleIcon from 'components/SvgIcons/QuestionCircle/QuestionCircleIcon'
import IconDeleteOutline from 'components/SvgIcons/DeleteOutline/IconDeleteOutline'

import { BaseDropdown } from 'components/BaseDropdown'
import { TextMiddleTruncate } from 'components/TextMiddleTruncate'
import { SingleEmailComposeDrawer } from 'components/EmailCompose'

import { useIconStyles } from 'views/../styles/use-icon-styles'

import {
  DOCUSIGN_ENVELOPE,
  DOCUSIGN_FILE,
  DOCUSIGN_FORM,
  EMAIL_ENVELOPE,
  EMAIL_FILE,
  EMAIL_FORM
} from 'deals/components/ActionsButton/data/action-buttons'

import { IAppState } from 'reducers'

import {
  CANCEL,
  REMOVE_ATTACHMENT,
  SET_DRAWER_STATUS
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

  const user = useSelector<IAppState, IUser>(({ user }) => user)

  const cancel = () => {
    dispatch({
      type: CANCEL
    })
  }

  const handleCloseEmailDrawer = () => {
    cancel()
    handleCloseDrawer()
  }

  const handleCloseSignatureDrawer = () => {
    cancel()
    handleCloseDrawer()
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
                    <QuestionCircleIcon />
                  </Typography>
                </Button>
              )}
              renderMenu={() => (
                <MenuList>
                  {state.attachments.map(attachment => (
                    <MenuItem key={attachment.id}>
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
                          <IconDeleteOutline className={iconClasses.small} />
                        </IconButton>
                      </Box>
                    </MenuItem>
                  ))}
                </MenuList>
              )}
            />

            <Button color="secondary" onClick={cancel}>
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
          from: user,
          attachments: state.attachments
        }}
        deal={deal}
        onClickAddDealAttachments={handleCloseDrawer}
        onClose={handleCloseEmailDrawer}
        onSent={handleCloseEmailDrawer}
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
        onClose={handleCloseSignatureDrawer}
      />
    </>
  )
}
