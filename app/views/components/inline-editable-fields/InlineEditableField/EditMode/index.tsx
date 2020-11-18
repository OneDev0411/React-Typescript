import React, { ReactNode, CSSProperties } from 'react'
import {
  Button,
  IconButton,
  Box,
  Popover,
  makeStyles,
  Theme
} from '@material-ui/core'

import { mdiTrashCanOutline } from '@mdi/js'
import cn from 'classnames'

import { noop } from 'utils/helpers'
import Tooltip from 'components/tooltip'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { EditModeActionBar, EditModeContainer } from '../../styled'

export interface Props {
  error?: string
  hasError?: boolean
  handleCancel: () => void
  handleDelete?: () => void
  handleSave: () => void
  isDisabled?: boolean
  render: (props: any) => ReactNode
  showDelete?: boolean
  isStatic?: boolean
  isEditing: boolean
  isPopoverMode?: boolean
  style?: CSSProperties
  viewRef?: any
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    popoverContainer: {
      padding: theme.spacing(2),
      minWidth: '340px',
      maxWidth: '340px',
      overflow: 'hidden'
    },
    editModePopover: {
      paddingTop: theme.spacing(1),
      borderTop: `1px solid ${theme.palette.divider}`
    }
  }),
  { name: 'InlineEditableFieldEditMode' }
)

export const EditMode = (props: Props) => {
  const {
    render,
    error = '',
    isDisabled = false,
    handleSave,
    handleCancel,
    handleDelete = noop,
    showDelete = false,
    isStatic = false,
    isPopoverMode = false,
    style = {},
    viewRef = null
  } = props
  const classes = useStyles()
  const open = Boolean(viewRef)
  const id = open ? 'edit-popover' : undefined

  const renderBody = (
    <>
      {render(props)}
      <EditModeActionBar
        showDelete={showDelete}
        isStatic={isStatic}
        className={cn({ [classes.editModePopover]: isPopoverMode })}
      >
        {showDelete && (
          <Tooltip caption="Delete">
            <IconButton
              size="small"
              disabled={isDisabled}
              onClick={handleDelete}
              data-test="inline-editable-field-delete"
            >
              <SvgIcon path={mdiTrashCanOutline} />
            </IconButton>
          </Tooltip>
        )}
        <Box display="flex" alignItems="center">
          <Box marginRight={1}>
            <Button size="small" disabled={isDisabled} onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            disabled={isDisabled}
            onClick={handleSave}
            data-test="inline-editable-field-save"
          >
            {isDisabled ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      </EditModeActionBar>
    </>
  )

  if (isPopoverMode) {
    return (
      <Popover
        id={id}
        open={open}
        anchorEl={viewRef}
        onClose={handleCancel}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left'
        }}
      >
        <div className={classes.popoverContainer}>{renderBody}</div>
      </Popover>
    )
  }

  return (
    <EditModeContainer
      hasError={!!error}
      style={style}
      isStatic={isStatic}
      className={isStatic ? 'is-static' : ''}
      data-test="inline-editable-field-container"
    >
      {renderBody}
    </EditModeContainer>
  )
}
