import React from 'react'
import { SearchContainer, Input, Title } from './styled'
import IconKeyboardArrowDown from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'
import IconKeyboardArrowUp from 'components/SvgIcons/KeyboardArrowUp/IconKeyboardArrowUp'
import Spinner from 'components/Spinner'

function getIcon(isMenuOpen, isSaving) {
  let Icon = <IconKeyboardArrowDown />

  if (isMenuOpen) {
    Icon = <IconKeyboardArrowUp />
  }

  if (isSaving) {
    Icon = <Spinner />
  }

  return Icon
}

export const SearchInput = ({
  getInputProps,
  searchable,
  isSaving,
  isMenuOpen,
  selectedTask,
  placeholder,
  value,
  onClick,
  onFocus,
  disabled
}) => (
  <SearchContainer
    isBlock
    appearance="outline"
    onClick={onClick}
    disabled={disabled}
  >
    {searchable && (
      <Input
        {...getInputProps({ placeholder, value })}
        onFocus={onFocus}
        disabled={disabled}
      />
    )}

    {!searchable && (
      <Title hasTask={selectedTask !== undefined}>
        {(selectedTask && selectedTask.title) || value || 'Select a task'}
      </Title>
    )}

    {getIcon(isMenuOpen, isSaving)}
  </SearchContainer>
)
