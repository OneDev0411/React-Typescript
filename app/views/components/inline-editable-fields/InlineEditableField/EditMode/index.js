import React from 'react'
import PropTypes from 'prop-types'

import { noop } from 'utils/helpers'
import IconButton from 'components/Button/IconButton'
import ActionButton from 'components/Button/ActionButton'
import DeleteIcon from 'components/SvgIcons/DeleteOutline/IconDeleteOutline'

import { ActionBar, Container } from './styled'

export class EditMode extends React.Component {
  static propTypes = {
    handleDelete: PropTypes.func,
    handleSave: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool,
    render: PropTypes.func.isRequired,
    showDelete: PropTypes.bool,
    style: PropTypes.shape(),
    toggleMode: PropTypes.func.isRequired
  }

  static defaultProps = {
    isDisabled: false,
    handleDelete: noop,
    showDelete: false,
    style: {}
  }

  onSave = () => this.props.handleSave(this.props.toggleMode)

  onDelete = () => this.props.handleDelete(this.props.toggleMode)

  render() {
    const { isDisabled, showDelete } = this.props

    return (
      <Container style={this.props.style}>
        {this.props.render(this.props)}
        <ActionBar showDelete={showDelete}>
          {showDelete && (
            <IconButton isFit disabled={isDisabled} onClick={this.onDelete}>
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
              onClick={this.props.toggleMode}
            >
              Cancel
            </ActionButton>
            <ActionButton
              size="small"
              disabled={isDisabled}
              onClick={this.onSave}
            >
              {isDisabled ? 'Saving...' : 'Save'}
            </ActionButton>
          </div>
        </ActionBar>
      </Container>
    )
  }
}
