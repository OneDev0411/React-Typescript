import React from 'react'
import PropTypes from 'prop-types'

import { noop } from 'utils/helpers'
import IconButton from 'components/Button/IconButton'
import ActionButton from 'components/Button/ActionButton'
import DeleteIcon from 'components/SvgIcons/DeleteOutline/IconDeleteOutline'

import { ActionBar, Container } from '../../styled'

export class EditMode extends React.Component {
  static propTypes = {
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
    isDisabled: false,
    handleDelete: noop,
    showDelete: false,
    isStatic: false,
    style: {}
  }

  render() {
    const { isDisabled, showDelete } = this.props

    return (
      <Container
        style={this.props.style}
        isStatic={this.props.isStatic}
        className={this.props.isStatic ? 'is-static' : ''}
      >
        {this.props.render(this.props)}
        <ActionBar showDelete={showDelete} isStatic={this.props.isStatic}>
          {showDelete && (
            <IconButton
              isFit
              disabled={isDisabled}
              onClick={this.props.handleDelete}
            >
              <DeleteIcon />
            </IconButton>
          )}
          <div
            style={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ActionButton
              size="small"
              appearance="link"
              disabled={isDisabled}
              onClick={this.props.handleCancel}
            >
              Cancel
            </ActionButton>
            <ActionButton
              size="small"
              disabled={isDisabled}
              onClick={this.props.handleSave}
            >
              {isDisabled ? 'Saving...' : 'Save'}
            </ActionButton>
          </div>
        </ActionBar>
      </Container>
    )
  }
}
