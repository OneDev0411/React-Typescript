import React, { useState } from 'react'
import {
  Button,
  IconButton,
  Typography,
  Slide,
  makeStyles,
  Theme,
  Box,
  Divider,
  MenuList,
  MenuItem
} from '@material-ui/core'
import pluralize from 'pluralize'

import QuestionCircleIcon from 'components/SvgIcons/QuestionCircle/QuestionCircleIcon'
import IconDeleteOutline from 'components/SvgIcons/DeleteOutline/IconDeleteOutline'

import { BaseDropdown } from 'components/BaseDropdown'

import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

import { useIconStyles } from 'views/../styles/use-icon-styles'

import {
  CLEAR_ATTACHMENTS,
  REMOVE_ATTACHMENT
} from '../actions-context/constants'
import { useChecklistActionsContext } from '../actions-context/hooks'

import GetSignature from '../../../Signature'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      position: 'sticky',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(0, 2),
      bottom: 0,
      height: theme.spacing(8),
      background: theme.palette.grey['100'],
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
    popover: {
      zIndex: 1000,
      pointerEvents: 'none'
    },
    paper: {
      padding: theme.spacing(1)
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
  const [isDocusignDraweOpen, setIsDocusignDrawerOpen] = useState(false)

  const handleDeselectAll = () => {
    dispatch({
      type: CLEAR_ATTACHMENTS
    })
  }

  const handleRemoveAttachment = (attachment: IDealFile) => {
    dispatch({
      type: REMOVE_ATTACHMENT,
      attachment
    })
  }

  return (
    <>
      {state.attachments.length > 0 && (
        <Slide in direction="up">
          <div className={classes.root}>
            <div>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setIsDocusignDrawerOpen(true)}
              >
                Docusign
              </Button>

              <Button variant="outlined" color="secondary" disabled>
                Send Email
              </Button>
            </div>

            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <BaseDropdown
                renderDropdownButton={props => (
                  <Button {...props}>
                    <Typography variant="body1" className={classes.title}>
                      {pluralize('file', state.attachments.length, true)}{' '}
                      selected &nbsp;
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
                            <TextMiddleTruncate
                              text={attachment.name}
                              maxLength={50}
                            />
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

              <Divider
                orientation="vertical"
                flexItem
                className={classes.divider}
              />
              <Button color="secondary" onClick={handleDeselectAll}>
                Deselect all
              </Button>
            </Box>
          </div>
        </Slide>
      )}

      <GetSignature
        deal={deal}
        isOpen={isDocusignDraweOpen}
        defaultAttachments={state.attachments}
        onClose={() => setIsDocusignDrawerOpen(false)}
      />
    </>
  )
}
