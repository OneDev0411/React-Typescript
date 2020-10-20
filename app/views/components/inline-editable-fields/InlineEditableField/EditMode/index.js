import React from 'react'
import PropTypes from 'prop-types'
import { Button, IconButton, Box } from '@material-ui/core'

import { mdiTrashCanOutline } from '@mdi/js'

import { noop } from 'utils/helpers'
import Tooltip from 'components/tooltip'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { EditModeActionBar, EditModeContainer } from '../../styled'

export class EditMode extends React.Component {
  static propTypes = {
    error: PropTypes.string,
    handleCancel: PropTypes.func.isRequired,
    handleDelete: PropTypes.func,
    handleSave: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool,
    render: PropTypes.func.isRequired,
    showDelete: PropTypes.bool,
    isStatic: PropTypes.bool,
    isEditing: PropTypes.bool,
    isPopoverMode: PropTypes.bool,
    style: PropTypes.shape()
  }

  static defaultProps = {
    error: '',
    isDisabled: false,
    handleDelete: noop,
    showDelete: false,
    isStatic: false,
    isPopoverMode: false,
    style: {}
  }

  render() {
    const {
      error,
      style,
      isStatic,
      showDelete,
      isDisabled,
      handleSave,
      handleCancel,
      handleDelete
    } = this.props

    return (
      <EditModeContainer
        hasError={!!error}
        style={style}
        isStatic={isStatic}
        className={isStatic ? 'is-static' : ''}
        data-test="inline-editable-field-container"
      >
        {this.props.render(this.props)}
        <EditModeActionBar showDelete={showDelete} isStatic={isStatic}>
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
      </EditModeContainer>
    )
  }
}
