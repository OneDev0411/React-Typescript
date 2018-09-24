import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Avatar from '../../Avatar'
import Button from '../../Button/IconButton'
import CloseIcon from '../../SvgIcons/Close/CloseIcon'
import { Container, Title, Details } from '../../AssocationItem/styled'

import { getUserTitle, getUserInfo } from '../helpers'

const Item = Container.extend`
  &:hover {
    cursor: initial;
  }
`

export class AssigneeItem extends Component {
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
    const info = getUserInfo(user)

    return (
      <Item>
        <Avatar image={user.profile_image_url} title={title} />
        <div style={{ marginLeft: '0.5em' }}>
          <Title>{title}</Title>
          <Details>{info}</Details>
        </div>
        <Button
          isFit
          inverse
          type="button"
          onClick={this.onRemove}
          style={{ marginLeft: '0.75em' }}
        >
          <CloseIcon />
        </Button>
      </Item>
    )
  }
}
