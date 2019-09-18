import React from 'react'
import { Box } from '@material-ui/core'
import uniqBy from 'lodash/uniqBy'

import { Tag } from './Tag'

interface Props {
  tags: ICRMTag[]
}

export default function TagsList(props: Props) {
  return (
    <Box display="flex" alignItems="center" flexWrap="wrap">
      {uniqBy(props.tags, tag => tag.text).map(tag => (
        <Tag key={tag.id} text={tag.text} />
      ))}
    </Box>
  )
}
