import React from 'react'
import styled from 'styled-components'
import Checkmark from '../../../../Partials/Svgs/Checkmark'

const chooseColor = isSelected => (isSelected ? '#17283a' : '#2196f3')
const TagContainer = styled.div`
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px;
  border-color: ${({ isSelected }) => chooseColor(isSelected)};
  color: ${({ isSelected }) => chooseColor(isSelected)};
  padding: 8px 16px;
  margin-right: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  :hover {
    background-color: #eff5fa;
  }
`

const CheckmarkContainer = styled.span`
  margin-right: 16px;
`
const Tag = ({ tag, onSelectionChange, tagDataType }) => (
  <TagContainer isSelected={tag.isSelected} onClick={onSelectionChange}>
    {tag.isSelected && (
      <CheckmarkContainer>
        <Checkmark color="#17283a" />
      </CheckmarkContainer>
    )}
    {tag[tagDataType]}
  </TagContainer>
)

export default Tag
