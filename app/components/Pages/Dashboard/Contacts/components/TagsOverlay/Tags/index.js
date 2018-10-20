import React from 'react'
import styled from 'styled-components'

import Tag from './Tag'

const TagsContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 0;
`
const Tags = ({ tags, onSelectionChange, tagDataType }) => (
  <TagsContainer>
    {tags.map((tag, tagIndex) => (
      <Tag
        key={tagIndex}
        tag={tag}
        tagDataType={tagDataType}
        onSelectionChange={() => onSelectionChange(tagIndex, !tag.isSelected)}
      />
    ))}
  </TagsContainer>
)

export default Tags
