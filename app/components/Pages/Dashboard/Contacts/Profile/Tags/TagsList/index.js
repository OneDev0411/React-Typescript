import React from 'react'
import PropTypes from 'prop-types'
import { Box } from '@material-ui/core'
import uniq from 'lodash/uniq'

import { Tag } from './Tag'

TagsList.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.shape()).isRequired
}

export function TagsList(props) {
  return (
    <Box display="flex" alignItems="center" flexWrap="wrap">
      {uniq(props.tags, tag => tag.text).map(tag => (
        <Tag key={tag.id} text={tag.text} />
      ))}
    </Box>
  )
}
