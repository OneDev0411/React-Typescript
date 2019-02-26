import React from 'react'
import ClickOutside from 'react-click-outside'

import RolesEdit from './Role'

import { Container } from './styled'

export class ContextInlineEdit extends React.Component {
  position = null

  get Position() {
    if (this.position) {
      return this.position
    }

    // get bounds
    const { bounds } = this.props.item.data
    const ww = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    )

    const width = 400

    const left =
      bounds.left + window.scrollX + width < ww
        ? bounds.left + window.scrollX
        : bounds.right - width
    const top = bounds.top + window.scrollY

    const position = {
      left,
      top,
      width
    }

    this.position = position

    return position
  }

  get Editor() {
    const { type } = this.props.item

    const sharedProps = {
      ...this.props.item.data,
      deal: this.props.deal
    }

    if (type === 'Role') {
      return <RolesEdit {...sharedProps} />
    }

    return null
  }

  render() {
    console.log(this.props)

    return (
      <ClickOutside onClickOutside={this.props.onDismiss}>
        <Container position={this.Position}>{this.Editor}</Container>
      </ClickOutside>
    )
  }
}
