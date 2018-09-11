import React from 'react'
import Flex from 'styled-flex-component'

import Tag from './Tag'

const Tags = ({ tags, onSelectionChange, tagDataType }) => (
  <Flex alignCenter wrap style={{ padding: '0 1em' }}>
    {tags.map((tag, tagIndex) => (
      <Tag
        key={tagIndex}
        tag={tag}
        tagDataType={tagDataType}
        onSelectionChange={() => onSelectionChange(tagIndex, !tag.isSelected)}
      />
    ))}
  </Flex>
)

export default Tags
