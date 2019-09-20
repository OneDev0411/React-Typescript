import React from 'react'
import PropTypes from 'prop-types'
import { Box } from '@material-ui/core'

import { Checkbox } from 'components/Checkbox'
import { Label } from 'components/inline-editable-fields/styled'

Title.propTypes = {
  attribute: PropTypes.shape().isRequired,
  onChangePrimary: PropTypes.func
}

export function Title(props) {
  const { attribute } = props

  return (
    <Box mb={1} display="flex" alignItems="center">
      <Label style={{ marginRight: '1rem' }}>
        {attribute.attribute_def.label}
      </Label>
      {!attribute.attribute_def.singular && (
        <Checkbox
          id={attribute.id || attribute.cuid}
          checked={attribute.is_primary || false}
          onChange={props.onChangePrimary}
        >
          Primary
        </Checkbox>
      )}
    </Box>
  )
}
