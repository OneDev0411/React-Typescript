import React from 'react'
import PropTypes from 'prop-types'

import { noop } from 'utils/helpers'
import Tooltip from 'components/tooltip'
import IconButton from 'components/Button/IconButton'
import ActionButton from 'components/Button/ActionButton'
import DeleteIcon from 'components/SvgIcons/DeleteOutline/IconDeleteOutline'

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
                isFit
                inverse
                disabled={isDisabled}
                onClick={this.props.handleDelete}
                data-test="inline-editable-field-delete"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
          <div
            style={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ActionButton
              size="small"
              inverse
              appearance="link"
              disabled={isDisabled}
              onClick={this.props.handleCancel}
              style={{ fontWeight: 500 }}
            >
              Cancel
            </ActionButton>
            <ActionButton
              size="small"
              disabled={isDisabled}
              onClick={this.props.handleSave}
              data-test="inline-editable-field-save"
            >
              {isDisabled ? 'Saving...' : 'Save'}
            </ActionButton>
          </div>
        </EditModeActionBar>
      </EditModeContainer>
    )
  }
}
