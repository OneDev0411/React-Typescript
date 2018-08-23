import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'
import _ from 'underscore'

import { Tag } from './Tag'

TagsList.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.shape()).isRequired
}

export function TagsList(props) {
  return (
    <Flex wrap="true">
      {_.uniq(props.tags, tag => tag.text).map(tag => (
        <Tag key={`tag_${tag.id}`} text={tag.text} />
      ))}
    </Flex>
  )
}
