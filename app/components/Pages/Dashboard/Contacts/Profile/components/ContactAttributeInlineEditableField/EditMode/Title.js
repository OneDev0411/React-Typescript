import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import { Checkbox } from 'components/Checkbox'
import { Label } from 'components/inline-editable-fields/styled'

Title.propTypes = {
  attribute: PropTypes.shape().isRequired,
  onChangePrimary: PropTypes.func
}

export function Title(props) {
  const { attribute } = props

  return (
    <Flex alignCenter style={{ marginBottom: '0.25em' }}>
      <Label style={{ marginRight: '0.5em' }}>
        {attribute.attribute_def.label}
      </Label>
      {!attribute.attribute_def.singular && (
        <Checkbox
          checked={attribute.is_primary || false}
          onChange={props.onChangePrimary}
        >
          Primary
        </Checkbox>
      )}
    </Flex>
  )
}
