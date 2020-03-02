import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Flex from 'styled-flex-component'

import Button from './Button'
import { iconAims } from '../helpers'

TextIconButton.propTypes = {
  /**
   * The button text.
   */
  text: PropTypes.string,

  /**
   * Sets an icon before the text. Can be any icon from Rechat SVG icons.
   */
  iconLeft: PropTypes.oneOf([PropTypes.func, PropTypes.object]),

  /**
   * The aim of the left icon. Not a big use case for this.
   */
  iconLeftAim: PropTypes.oneOf(Object.keys(iconAims)),

  /**
   * Sets an icon after the text. Can be any icon from Rechat SVG icons.
   */
  iconRight: PropTypes.func,

  /**
   * The aim of the right icon. Useful to aim a triangle down.
   */
  iconRightAim: PropTypes.oneOf(Object.keys(iconAims))
}

TextIconButton.defaultProps = {
  ...Button.defaultProps,
  appearance: 'outline',
  iconLeftAim: 'none',
  iconRightAim: 'none',
  text: ''
}

function TextIconButton({
  iconLeft,
  iconRight,
  iconLeftAim,
  iconRightAim,
  text,
  ...rest
}) {
  let IconLeft = () => null
  let IconRight = () => null

  if (iconLeft) {
    IconLeft = styled(iconLeft)`
      margin-right: ${text ? '0.5em' : 0};
      transform: rotate(${iconAims[iconLeftAim]});
    `
  }

  if (iconRight) {
    IconRight = styled(iconRight)`
      margin-left: ${text ? '0.15em' : 0};
      transform: rotate(${iconAims[iconRightAim]});
    `
  }

  const $text = text ? React.createElement('span', {}, text) : null

  return (
    <Button {...rest}>
      <Flex alignCenter>
        <IconLeft />
        {$text}
      </Flex>
      <IconRight />
    </Button>
  )
}

export default TextIconButton
