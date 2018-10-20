import React from 'react'
import styled from 'styled-components'

import { primary, grey } from 'views/utils/colors'
import IconCheckmark from '../../../../../../../views/components/SvgIcons/Checkmark/IconCheckmark'

const chooseColor = isSelected => (isSelected ? '#000000' : primary)

const TagContainer = styled.div`
  padding: 0.5em 1em;
  display: inline-flex;
  align-items: center;
  margin: 0 0.5em 0.5em 0;
  border: solid 1px;
  border-radius: 3px;
  background-color: #fff;
  color: ${({ isSelected }) => chooseColor(isSelected)};
  border-color: ${({ isSelected }) => chooseColor(isSelected)};
  cursor: pointer;

  :hover {
    background-color: ${grey.A100};
  }
`

const Tag = ({ tag, onSelectionChange, tagDataType }) => (
  <TagContainer isSelected={tag.isSelected} onClick={onSelectionChange}>
    {tag.isSelected && <IconCheckmark style={{ marginRight: '0.5rem' }} />}
    {tag[tagDataType]}
  </TagContainer>
)

export default Tag
