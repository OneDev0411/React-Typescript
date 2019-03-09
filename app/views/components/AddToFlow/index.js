import React from 'react'
import PropTypes from 'prop-types'
import ClickOutSide from 'react-click-outside'

import { addToFlow } from 'models/flows/add-to-flow'

import Icon from 'components/SvgIcons/Thunderbolt/ThunderboltIcon'
import Button from 'components/Button/TextIconButton'

import Flow from './Flow'

export class AddToFlow extends React.Component {
  static propTypes = {
    alignFrom: PropTypes.string,
    associations: PropTypes.shape({
      contacts: PropTypes.arrayOf(PropTypes.string.isRequired),
      deals: PropTypes.arrayOf(PropTypes.string.isRequired)
    }).isRequired,
    callback: PropTypes.func,
    style: PropTypes.shape()
  }

  static defaultProps = {
    alignFrom: 'right',
    callback() {},
    style: {}
  }

  state = {
    addError: '',
    isAdding: false,
    isOpen: false
  }

  open = () => this.setState({ isOpen: true })

  close = () => {
    if (!this.state.isAdding) {
      this.setState({ isOpen: false })
    }
  }

  add = async data => {
    if (this.state.isAdding) {
      return
    }

    try {
      this.setState({ isAdding: true })

      await addToFlow({
        ...data,
        ...this.props.associations
      })

      this.setState({ isAdding: false, isOpen: false }, this.props.callback)
    } catch (error) {
      this.setState({ addError: error.message })
    }
  }

  render() {
    return (
      <ClickOutSide onClickOutside={this.close}>
        <div style={{ position: 'relative', ...this.props.style }}>
          <Button
            text="Add to Flow"
            iconLeft={Icon}
            onClick={this.open}
            style={{ pointerEvents: this.state.isOpen ? 'none' : 'initial' }}
          />

          {this.state.isOpen && (
            <Flow
              addError={this.state.addError}
              alignFrom="right"
              isAdding={this.state.isAdding}
              handleAdd={this.add}
              handleClose={this.close}
            />
          )}
        </div>
      </ClickOutSide>
    )
  }
}
