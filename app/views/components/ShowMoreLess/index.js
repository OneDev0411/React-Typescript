import React, { Component } from 'react'
import Flex from 'styled-flex-component'

import { ShowMoreLessText, ArrowDown, ArrowUp } from './styled'

export class ShowMoreLess extends Component {
  static defaultProps = {
    defaultIsOpen: false,
    row: false,
    column: true,
    count: 7,
    moreText: 'Show More',
    lessText: 'Show Less',
    style: {}
  }

  state = {
    isOpen: this.props.defaultIsOpen
  }

  toggleState = () => {
    this.setState(({ isOpen }) => ({
      isOpen: !isOpen
    }))
  }

  renderShowMore = () => (
    <ShowMoreLessText data-test="show-more-button" onClick={this.toggleState}>
      {this.props.moreText}
      <ArrowDown />
    </ShowMoreLessText>
  )

  renderShowLess = () => (
    <ShowMoreLessText data-test="show-more-button" onClick={this.toggleState}>
      {this.props.lessText}
      <ArrowUp />
    </ShowMoreLessText>
  )

  renderAllChildren() {
    return (
      <Flex
        column={this.props.column}
        row={this.props.row}
        style={this.props.style}
      >
        {this.props.children}
      </Flex>
    )
  }

  renderOpenState() {
    return (
      <Flex
        column={this.props.column}
        row={this.props.row}
        style={this.props.style}
      >
        {this.props.children}
        {this.renderShowLess()}
      </Flex>
    )
  }

  renderCloseState() {
    return (
      <Flex
        column={this.props.column}
        row={this.props.row}
        style={this.props.style}
      >
        {React.Children.map(this.props.children, (child, i) =>
          i < this.props.count ? child : null
        )}
        {this.renderShowMore()}
      </Flex>
    )
  }

  render() {
    const childrenCount = React.Children.count(this.props.children)

    if (childrenCount <= this.props.count) {
      return this.renderAllChildren()
    }

    if (this.state.isOpen) {
      return this.renderOpenState()
    }

    return this.renderCloseState()
  }
}
