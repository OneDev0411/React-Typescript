import React from 'react'
import { Overlay, Popover } from 'react-bootstrap'

class PopOver extends React.Component {
  state = {
    show: false
  }

  onMouseEnter = () => this.setState({ show: true })

  onMouseLeave = () => this.setState({ show: false })

  render() {
    const {
      id = 'rechat-tooltip',
      caption,
      placement = 'top',
      overlayOptions = {
        trigger: ['hover']
      },
      popoverStyles = {},
      containerStyle = {},
      children
    } = this.props

    if (!caption) {
      return children
    }

    return (
      <div
        style={containerStyle}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        {children}

        <Overlay
          show={this.state.show}
          target={this}
          placement={placement}
          {...overlayOptions}
        >
          <Popover
            className="white--popover"
            id={id}
            style={{ ...popoverStyles }}
          >
            {caption}
          </Popover>
        </Overlay>
      </div>
    )
  }
}

export default PopOver
