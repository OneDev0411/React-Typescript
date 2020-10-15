import React, { CSSProperties, ReactNode } from 'react'
import classNames from 'classnames'
import { Overlay, Popover } from 'react-bootstrap'

interface Props {
  id?: string
  caption?: ReactNode
  placement?: 'top' | 'bottom' // probably more
  overlayOptions?: {
    trigger?: 'hover'[]
  }
  popoverStyles?: CSSProperties
  containerStyle?: CSSProperties
  show?: boolean
  dark?: boolean
}

interface State {
  show: boolean
}

class PopOver extends React.Component<Props, State> {
  state = {
    show: !!this.props.show
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
            className={classNames(
              'pop-over',
              this.props.dark ? 'pop-over--dark' : 'pop-over--light'
            )}
            id={id}
            style={popoverStyles}
          >
            {caption}
          </Popover>
        </Overlay>
      </div>
    )
  }
}

export default PopOver
