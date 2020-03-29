import React, { Component } from 'react'
import Flex from 'styled-flex-component'

import { ShowMoreLessText, ArrowDown, ArrowUp } from './styled'

export class ShowMoreLess extends Component {
  static defaultProps = {
    defaultOpen: false,
    row: false,
    column: true,
    count: 7,
    moreText: 'Show More',
    lessText: 'Show Less',
    textStyle: {},
    style: {}
  }

  state = {
    isOpen: this.props.defaultOpen
  }

  toggleState = () => {
    this.setState(({ isOpen }) => ({
      isOpen: !isOpen
    }))
  }

  renderShowMore = () => {
    const { textStyle } = this.props

    return (
      <ShowMoreLessText
        style={textStyle}
        data-test="show-more-button"
        onClick={this.toggleState}
      >
        {this.props.moreText}
        <ArrowDown />
      </ShowMoreLessText>
    )
  }

  renderShowLess = () => {
    const { textStyle } = this.props

    return (
      <ShowMoreLessText
        style={textStyle}
        data-test="show-more-button"
        onClick={this.toggleState}
      >
        {this.props.lessText}
        <ArrowUp />
      </ShowMoreLessText>
    )
  }

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
    const { textContainer: Container } = this.props
    const text = this.renderShowLess()

    return (
      <Flex
        column={this.props.column}
        row={this.props.row}
        style={this.props.style}
      >
        {this.props.children}
        {Container ? <Container>{text}</Container> : text}
      </Flex>
    )
  }

  renderCloseState() {
    const { textContainer: Container } = this.props
    const text = this.renderShowMore()

    return (
      <Flex
        column={this.props.column}
        row={this.props.row}
        style={this.props.style}
      >
        {React.Children.map(this.props.children, (child, i) =>
          i < this.props.count ? child : null
        )}
        {Container ? <Container>{text}</Container> : text}
      </Flex>
    )
  }

  render() {
    const { children, count } = this.props
    const { isOpen } = this.state
    const childrenCount = React.Children.count(children)

    if (childrenCount <= count) {
      return this.renderAllChildren()
    }

    return isOpen ? this.renderOpenState() : this.renderCloseState()
  }
}
