import styled, { css } from 'styled-components'
import { ButtonProps } from '@material-ui/core'

import { HTMLProps } from 'react'

import { ButtonAppearances } from '../styles/ButtonAppearances'

export interface ActionButtonProps
  extends Omit<HTMLProps<HTMLButtonElement>, 'size' | 'ref' | 'type'> {
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

  type?: ButtonProps['type']

  /**
   * The brand color of active team.
   */
  brandColor?: string

  noBorder?: boolean
  isOpen?: boolean

  rightRounded?: boolean // !
  leftRounded?: boolean // !
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

export const getSizeDependentStyles = props => {
  switch (props.size) {
    case 'small': {
      const size = 2.33

      return {
        height: `${size}em`,
        fontSize: '0.875rem',
        lineHeight: size
      }
    }

    case 'large': {
      const size = 2.39

      return {
        height: `${size}em`,
        fontSize: '1.125rem',
        lineHeight: size
      }
    }

    default: {
      const size = 2.375 // MUI button height / 1rem

      return {
        height: `${size}em`,
        fontSize: '1rem',
        lineHeight: size
      }
    }
  }
}

export const getAppearance = props => {
  let appearance = props.appearance

  return css`
    ${ButtonAppearances[appearance]};
    ${getSizeDependentStyles(props)};
    padding: 0 1rem;
  `
}

const Button = styled.button<ActionButtonProps>(getAppearance)

Button.defaultProps = defaultProps

export default Button
