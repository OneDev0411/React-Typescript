import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import { ButtonAppearances } from '../styles/ButtonAppearances'

const propTypes = {
  /**
   * The appearance of the button.  {default, ghost}
   */
  appearance: PropTypes.oneOf(Object.keys(ButtonAppearances)),

  /**
   * When true, the button is disabled.
   */
  disabled: PropTypes.bool,

  /**
   * DEPRECATED
   * When true, the button appearances should be ghost.
   */
  inverse: PropTypes.bool,

  /**
   * The size of the button. {small, medium, large}
   */
  size: PropTypes.oneOf(['small', 'medium', 'large'])
}

const defaultProps = {
  appearance: 'default',
  disabled: false,
  inverse: false,
  size: 'medium'
}

const getStylesDependedSize = size => {
  switch (size) {
    case 'small':
      return {
        fontSize: '14px',
        lineHeight: '32px',
        padding: '0 8px'
      }

    case 'large':
      return {
        fontSize: '18px',
        lineHeight: '48px',
        padding: '0 16px'
      }

    default:
      return {
        fontSize: '16px',
        lineHeight: '40px',
        padding: '0 16px'
      }
  }
}

const getAppearance = props => {
  let appearance = props.appearance

  if (props.inverse) {
    appearance = 'outline'
  }

  return css`
    ${ButtonAppearances[appearance]} ${getStylesDependedSize(
      props.size
    )}

    position: relative;
    font-family: Barlow;
    font-weight: normal;
    display: inline-flex;
    align-items: center;
    flex-wrap: nowrap;
    border-radius: 3px;
    margin: 0;
  `
}

const Button = styled.button(getAppearance)

export default Object.assign(Button, {
  propTypes,
  defaultProps
})
