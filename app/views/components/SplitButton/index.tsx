import React, { CSSProperties, HTMLProps, ReactNode } from 'react'
import Downshift from 'downshift'

import IconKeyboardArrowDown from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'
import IconKeyboardArrowUp from 'components/SvgIcons/KeyboardArrowUp/IconKeyboardArrowUp'

import {
  SplitButtonMenu,
  ButtonsContainer,
  PrimaryActionButton,
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
  disabled: boolean
}

/**
 * This component can be used to render an action button with a list of dropdown actions
 */
export default function SplitButton({
  children,
  renderMenu,
  onClick,
  disabled,
  style = {}
}: Props) {
  return (
    <Downshift>
      {({ isOpen, getToggleButtonProps, closeMenu }) => (
        <div style={{ ...style, position: 'relative' }}>
          <ButtonsContainer>
            <PrimaryActionButton disabled={disabled} onClick={onClick}>
              {children}
            </PrimaryActionButton>
            <ToggleActionsMenuButton
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
