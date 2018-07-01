import React from 'react'

import { validator, format, parse } from './helpers'
import MultiFields from '../Details/components/MultiFields'

export function Birthday(props) {
  return (
    <MultiFields
      attributeName="birthday"
      contact={props.contact}
      handleFormat={format}
      handleParse={parse}
      placeholder="MM/DD/YYYY"
      validator={validator}
      validationText="Invalid format. Valid format MM/DD/YYYY"
    />
  )
}
