import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Avatar from './Avatar'

import IconButton from '../../../../../../views/components/Button/IconButton'
import ArrowDownIcon from '../../../../../../views/components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

import { SideNavTooltip } from './Tooltip'

export class SettingsDropdownButton extends Component {
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
          style={{ alignItems: 'flex-end', padding: 0 }}
        >
          <Avatar user={this.props.user} size={32} />
          <ArrowDownIcon
            style={{
              transform: this.props.isDropDownOpen ? 'rotate(180deg)' : 'none'
            }}
          />
        </IconButton>
      </SideNavTooltip>
    )
  }
}
