import React, { Fragment } from 'react'

import IconKeyboardArrowDown from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'
import IconKeyboardArrowUp from 'components/SvgIcons/KeyboardArrowUp/IconKeyboardArrowUp'
import Spinner from 'components/Spinner'

import {
  SearchContainer,
  TitleContainer,
  Input,
  Title,
  SubTitle
} from './styled'

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
  subTitle,
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
      <TitleContainer>
        <Input
          {...getInputProps({ placeholder, value })}
          onFocus={onFocus}
          disabled={disabled}
        />
        {subTitle && <SubTitle>{subTitle}</SubTitle>}
      </TitleContainer>
    )}

    {!searchable && (
      <TitleContainer>
        <Title hasTask={selectedTask !== undefined}>
          {(selectedTask && selectedTask.title) || value || 'Select a task'}
        </Title>

        {subTitle && <SubTitle>{subTitle}</SubTitle>}
      </TitleContainer>
    )}

    {getIcon(isMenuOpen, isSaving)}
  </SearchContainer>
)
