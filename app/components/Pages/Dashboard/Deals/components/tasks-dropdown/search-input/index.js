import React from 'react'
import { SearchContainer, Input, Title, Indicator } from './styled'

function getIcon(isMenuOpen, isSaving) {
  let iconName = 'fa-caret-down'

  if (isMenuOpen) {
    iconName = 'fa-caret-up'
  }

  if (isSaving) {
    iconName = 'fa-spin fa-cog'
  }

  return `fa ${iconName}`
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
  onFocus
}) => (
  <SearchContainer onClick={onClick}>
    {searchable && (
      <Input {...getInputProps({ placeholder, value })} onFocus={onFocus} />
    )}

    {!searchable && (
      <Title hasTask={selectedTask !== undefined}>
        {(selectedTask && selectedTask.title) || value || 'Select a task'}
      </Title>
    )}

    <Indicator className={getIcon(isMenuOpen, isSaving)} />
  </SearchContainer>
)
