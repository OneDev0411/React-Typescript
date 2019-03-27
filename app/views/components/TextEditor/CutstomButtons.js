import React from 'react'

import IconTextSize from '../SvgIcons/TextSize/IconTextSize'

import { RechatButton, RechatTextButton } from './styled'

function CustomButton({
  toggleInlineStyle,
  isActive,
  onMouseDown,
  iconComponent
}) {
  return (
    <RechatButton
      onClick={toggleInlineStyle}
      onMouseDown={onMouseDown}
      isActive={isActive}
    >
      {iconComponent}
    </RechatButton>
  )
}

function CustomBlockButton({ toggleBlockType, isActive, iconComponent }) {
  return (
    <RechatButton onClick={toggleBlockType} isActive={isActive}>
      {iconComponent}
    </RechatButton>
  )
}

function CustomHButton({ toggleBlockType, isActive, title, setOpen, isOpen }) {
  return (
    <RechatTextButton
      onClick={() => {
        toggleBlockType()
        setOpen(!isOpen)
      }}
      isActive={isActive}
    >
      {title}
    </RechatTextButton>
  )
}

function TextSizeButton(props) {
  return (
    <RechatButton as="div">
      <span onClick={() => props.setOpen(!props.isOpen)}>
        <IconTextSize />
      </span>

      <span className={`PopOver ${props.isOpen ? 'opened' : ''}`}>
        {props.children}
      </span>
    </RechatButton>
  )
}

export { CustomButton, CustomBlockButton, CustomHButton, TextSizeButton }
