import React from 'react'
import PropTypes from 'prop-types'
import { Box } from '@material-ui/core'

import { Label } from 'components/inline-editable-fields/styled'

Title.propTypes = {
  attribute: PropTypes.shape().isRequired
}

export function Title(props) {
  const { attribute } = props

  return (
    <Box mb={1} display="flex" alignItems="center">
      <Label style={{ marginRight: '1rem' }}>
        {attribute.attribute_def.label}
      </Label>
    </Box>
  )
}
