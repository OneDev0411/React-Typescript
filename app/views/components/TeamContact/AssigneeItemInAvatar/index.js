import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Avatar from '../../Avatar'
import Tooltip from '../../tooltip'
import IconButton from '../../Button/IconButton'
import CloseIcon from '../../SvgIcons/Close/CloseIcon'

import { getUserTitle } from '../helpers'

const Icon = CloseIcon.extend`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  opacity: 0;
  visibility: hidden;
`

const Button = IconButton.extend`
  width: 2em;
  height: 2em;
  position: relative;
  margin-right: 0.5em;

  &:hover {
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 100%;
      background-color: rgba(0, 0, 0, 0.7);
    }

    > ${Icon} {
      opacity: 1;
      fill: #fff;
      visibility: visible;
    }
  }
`

export class AssigneeItemInAvatar extends Component {
  static propTypes = {
    user: PropTypes.shape().isRequired,
    removeHandler: PropTypes.func.isRequired
  }

  onRemove = () => {
    this.props.removeHandler(this.props.user.id)
  }

  render() {
    const { user } = this.props
    const title = getUserTitle(user)

    return (
      <Tooltip placeme="top" caption={title}>
        <Button isFit onClick={this.onRemove}>
          <Avatar image={user.profile_image_url} title={title} size={32} />
          <Icon />
        </Button>
      </Tooltip>
    )
  }
}
