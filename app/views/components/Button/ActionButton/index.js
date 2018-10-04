import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import { isOutline } from '../helpers'
import { ButtonAppearances } from '../styles/ButtonAppearances'

const propTypes = {
  /**
   * The appearance of the button.  {primary, outline, icon, link}
   */
  appearance: PropTypes.oneOf(Object.keys(ButtonAppearances)),

  /**
   * When true, the button is disabled.
   */
  disabled: PropTypes.bool,

  /**
   * When true, the button is activated.
   */
  isActive: PropTypes.bool,

  /**
   * When true, the button width is 100%.
   */
  isBlock: PropTypes.bool,

  /**
   * DEPRECATED
   * When true, the button appearances should be ghost.
   */
  inverse: PropTypes.bool,

  /**
   * The size of the button.
   */
  size: PropTypes.oneOf(['small', 'medium', 'large', 'XLarge']),

  /**
   * The brand color of active team.
   */
  brandColor: PropTypes.string
}

const defaultProps = {
  appearance: 'primary',
  disabled: false,
  isActive: false,
  isBlock: false,
  inverse: false,
  size: 'medium',
  brandColor: ''
}

const getStylesDependedSize = props => {
  switch (props.size) {
    case 'small':
      return {
        height: '2.2857142857142856em',
        fontSize: '0.875rem',
        lineHeight: isOutline(props) ? 2.142857142857143 : 2.2857142857142856
      }

    case 'large':
      return {
        height: '2.6666666666666665em',
        fontSize: '1.125rem',
        lineHeight: isOutline(props) ? 2.5555555555555554 : 2.6666666666666665
      }

    default:
      return {
        height: '2.5em',
        fontSize: '1rem',
        lineHeight: isOutline(props) ? 2.375 : 2.5
      }
  }
}

const getAppearance = props => {
  let appearance = props.appearance

  return css`
    ${ButtonAppearances[appearance]};
    ${getStylesDependedSize(props)};
    padding: 0 1rem;
  `
}

const Button = styled.button(getAppearance)

export default Object.assign(Button, {
  propTypes,
  defaultProps
})
