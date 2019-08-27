import styled, { css } from 'styled-components'

import { HTMLProps } from 'react'

import { isOutline } from '../helpers'
import { ButtonAppearances } from '../styles/ButtonAppearances'

export interface ActionButtonProps
  extends Omit<HTMLProps<HTMLButtonElement>, 'size' | 'ref'> {
  /**
   * The appearance of the button.  {primary, outline, icon, link}
   */
  appearance?: keyof typeof ButtonAppearances

  /**
   * When true, the button is disabled.
   */
  disabled?: boolean

  /**
   * When true, the button is activated.
   */
  isActive?: boolean

  /**
   * When true, the button width is 100%.
   */
  isBlock?: boolean

  /**
   * DEPRECATED
   * When true, the button appearances should be ghost.
   */
  inverse?: boolean

  /**
   * The size of the button.
   */
  size?: 'small' | 'medium' | 'large' | 'XLarge'

  /**
   * The brand color of active team.
   */
  brandColor?: string

  noBorder?: boolean
  isOpen?: boolean

  rightRounded?: boolean // !
}

export const defaultProps: Partial<ActionButtonProps> = {
  type: 'button',
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

export const getAppearance = props => {
  let appearance = props.appearance

  return css`
    ${ButtonAppearances[appearance]};
    ${getStylesDependedSize(props)};
    padding: 0 1rem;
  `
}

const Button = styled.button<ActionButtonProps>(getAppearance)

Button.defaultProps = defaultProps

export default Button
