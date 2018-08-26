import React from 'react'
import PropTypes from 'prop-types'

import IconButton from '../../Button/IconButton'
import IconClose from '../../SvgIcons/Close/CloseIcon'
import { Box, Button } from './styled'

class TagButton extends React.Component {
  static propTypes = {
    /**
     * Render button text.
     */
    RenderText: PropTypes.func.isRequired,

    /**
     * Render an icon before the text. Can be any icon from Rechat SVG icons.
     */
    RenderIcon: PropTypes.func,

    /**
     * Close button handler.
     */
    handleRemove: PropTypes.func.isRequired
  }

  static defaultProps = {
    RenderIcon: null
  }

  state = {
    isShowClose: false
  }

  showCloseIcon = () => {
    this.setState({ isShowClose: true })
  }

  hideCloseIcon = () => this.setState({ isShowClose: false })

  render() {
    const { RenderIcon, RenderText, ...rest } = this.props

    return (
      <Box
        alignCenter
        style={{ padding: `0 8px 0 ${RenderIcon ? '8px' : '16px'}` }}
      >
        <Button
          {...rest}
          onFocus={this.showCloseIcon}
          onMouseEnter={this.showCloseIcon}
          onMouseLeave={this.hideCloseIcon}
        >
          {RenderIcon && <RenderIcon style={{ marginRight: '8px' }} />}
          <RenderText />
        </Button>
        <IconButton inverse iconSize="large" onCLick={this.props.handleRemove}>
          {this.state.isShowClose && !rest.disabled && <IconClose />}
        </IconButton>
      </Box>
    )
  }
}

export default TagButton
