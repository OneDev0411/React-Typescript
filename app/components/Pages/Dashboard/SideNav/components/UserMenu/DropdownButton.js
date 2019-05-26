import React, { Component } from 'react'
import PropTypes from 'prop-types'

import IconButton from '../../../../../../views/components/Button/IconButton'

import UserAvatar from '../UserAvatar'

import { SideNavTooltip } from '../Tooltip'
import { DropdownDots } from './styled'

export class DropdownButton extends Component {
  static propTypes = {
    user: PropTypes.shape().isRequired
  }

  handleClick = e => {
    e.preventDefault()

    this.props.onClick(e)
  }

  render() {
    return (
      <SideNavTooltip caption="Settings">
        <IconButton
          iconSize="large"
          inverse
          onClick={this.handleClick}
          style={{ padding: 0 }}
        >
          <UserAvatar user={this.props.user} size={32} />
          <DropdownDots />
        </IconButton>
      </SideNavTooltip>
    )
  }
}