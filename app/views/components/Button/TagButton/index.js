import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Flex from 'styled-flex-component'

import IconButton from '../../Button/IconButton'
import IconClose from '../../SvgIcons/Close/CloseIcon'

import { buttonBaseStyle } from '../styles/ButtonAppearances'

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

    const isNotDisableState = '&:not([disabled]):'

    const Button = styled.button`
      ${buttonBaseStyle};

      padding: 0;
      margin-left: 8px;
      color: inherit;
      background-color: inherit;

      ${isNotDisableState}hover, ${isNotDisableState}focus {
        color: inherit;
      }
    `

    const Box = Flex.extend`
      height: 40px;
      font-size: 16px;
      line-height: 38px;
      padding: 0 8px 0 ${RenderIcon ? '8px' : '16px'};

      color: #000;
      background-color: #f2f2f2;

      &[disabled] {
        opacity: 0.5;
      }

      ${isNotDisableState}hover, ${isNotDisableState}focus {
        background-color: #fff;
        border: 1px solid #000;
      }

      svg {
        width: 24px;
        height: 24px;
        fill: '#000';
      }
    `

    return (
      <Box alignCenter>
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
