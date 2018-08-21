import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Avatar from './Avatar'

import IconButton from '../../../../../../views/components/Button/IconButton'
import ArrowDownIcon from '../../../../../../views/components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

export class SettingsDropdownButton extends Component {
  static propTypes = {
    user: PropTypes.shape().isRequired
  }

  state = {
    isOpen: false
  }

  handleClick = e => {
    e.preventDefault()

    this.setState(
      state => ({ isOpen: !state.isOpen }),
      () => this.props.onClick(e)
    )
  }

  render() {
    return (
      <IconButton
        iconSize="large"
        inverse
        onClick={this.handleClick}
        style={{ alignItems: 'flex-end' }}
      >
        <Avatar user={this.props.user} size={32} />
        <ArrowDownIcon
          style={{ transform: this.state.isOpen ? 'rotate(180deg)' : 'none' }}
        />
      </IconButton>
    )
  }
}
