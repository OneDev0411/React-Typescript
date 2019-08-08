import React, { CSSProperties, ReactNode } from 'react'
import Downshift from 'downshift'

import IconKeyboardArrowDown from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'
import IconKeyboardArrowUp from 'components/SvgIcons/KeyboardArrowUp/IconKeyboardArrowUp'

import {
  ButtonsContainer,
  PrimaryActionButton,
  SplitButtonMenu,
  ToggleActionsMenuButton
} from './styled'

const ARROW_ICON_STYLE = {
  display: 'block',
  height: '1.8rem'
}

interface RenderMenuProps {
  closeMenu: () => void
}

interface Props {
  renderMenu: (props: RenderMenuProps) => ReactNode
  children: ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  style: CSSProperties
  appearance?: 'primary' | 'default'
  disabled?: boolean
}

/**
 * NOTE: this component should be rewritten with material ui components
 * there is also a third-party library that we might want to use instead:
 * https://www.npmjs.com/package/material-ui-split-button
 */
export default function SplitButton({
  children,
  renderMenu,
  onClick,
  disabled,
  appearance = 'default',
  style = {}
}: Props) {
  return (
    <Downshift>
      {({ isOpen, getToggleButtonProps, closeMenu }) => (
        <div style={{ ...style, position: 'relative' }}>
          <ButtonsContainer>
            <PrimaryActionButton
              appearance={appearance}
              disabled={disabled}
              onClick={onClick}
            >
              {children}
            </PrimaryActionButton>
            <ToggleActionsMenuButton
              appearance={appearance}
              disabled={disabled}
              type="button"
              isActive={isOpen}
              {...getToggleButtonProps()}
            >
              {isOpen ? (
                <IconKeyboardArrowUp style={ARROW_ICON_STYLE} />
              ) : (
                <IconKeyboardArrowDown style={ARROW_ICON_STYLE} />
              )}
            </ToggleActionsMenuButton>
          </ButtonsContainer>
          <>
            {isOpen && (
              <SplitButtonMenu>{renderMenu({ closeMenu })}</SplitButtonMenu>
            )}
          </>
        </div>
      )}
    </Downshift>
  )
}
