import React from 'react'
import PropTypes from 'prop-types'
import { Button, IconButton, Box } from '@material-ui/core'

import { noop } from 'utils/helpers'
import Tooltip from 'components/tooltip'
import TrashIcon from 'components/SvgIcons/Trash/TrashIcon'

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
    style: PropTypes.shape()
  }

  static defaultProps = {
    error: '',
    isDisabled: false,
    handleDelete: noop,
    showDelete: false,
    isStatic: false,
    style: {}
  }

  render() {
    const { isDisabled, showDelete } = this.props

    return (
      <EditModeContainer
        hasError={!!this.props.error}
        style={this.props.style}
        isStatic={this.props.isStatic}
        className={this.props.isStatic ? 'is-static' : ''}
        data-test="inline-editable-field-container"
      >
        {this.props.render(this.props)}
        <EditModeActionBar
          showDelete={showDelete}
          isStatic={this.props.isStatic}
        >
          {showDelete && (
            <Tooltip caption="Delete">
              <IconButton
                size="small"
                disabled={isDisabled}
                onClick={this.props.handleDelete}
                data-test="inline-editable-field-delete"
              >
                <TrashIcon size="small" />
              </IconButton>
            </Tooltip>
          )}
          <Box display="flex" alignItems="center">
            <Box marginRight={1}>
              <Button
                size="small"
                disabled={isDisabled}
                onClick={this.props.handleCancel}
              >
                Cancel
              </Button>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              disabled={isDisabled}
              onClick={this.props.handleSave}
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
