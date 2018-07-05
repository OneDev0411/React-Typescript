import React from 'react'
import styled from 'styled-components'
import Tag from './Tag'

export const Container = styled.div`
  margin-top: 16px;
  margin-left: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
`

const Tags = ({ tags, onSelectionChange, tagDataType }) => (
  <Container>
    {tags.map((tag, tagIndex) => (
      <Tag
        key={tagIndex}
        tag={tag}
        tagDataType={tagDataType}
        onSelectionChange={() => onSelectionChange(tagIndex, !tag.isSelected)}
      />
    ))}
  </Container>
)

export default Tags
