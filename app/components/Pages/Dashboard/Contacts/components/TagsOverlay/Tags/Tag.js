import React from 'react'
import styled from 'styled-components'

import IconCheckmark from '../../../../../../../views/components/SvgIcons/Checkmark/IconCheckmark'

const chooseColor = (theme, isSelected) =>
  isSelected ? theme.palette.primary.main : '#000'

const TagContainer = styled.div`
  padding: 0.5em 1em;
  display: inline-flex;
  align-items: center;
  margin: 0 0.5em 0.5em 0;
  border: solid 1px;
  border-radius: 3px;
  background-color: #fff;
  color: ${({ theme, isSelected }) => chooseColor(theme, isSelected)};
  border-color: ${({ theme, isSelected }) => chooseColor(theme, isSelected)};
  cursor: pointer;

  :hover {
    background-color: ${props => props.theme.palette.grey[100]};
  }
`
const CheckIcon = styled(IconCheckmark)`
  margin-right: 0.5rem;
  fill: ${props => props.theme.palette.primary.main};
`

const Tag = ({ tag, onSelectionChange, tagDataType }) => (
  <TagContainer isSelected={tag.isSelected} onClick={onSelectionChange}>
    {tag.isSelected && <CheckIcon />}
    {tag[tagDataType]}
  </TagContainer>
)

export default Tag
