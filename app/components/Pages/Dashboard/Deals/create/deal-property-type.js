import React from 'react'

import { H2 } from 'components/Typography/headings'
import { BasicDropdown } from 'components/BasicDropdown'

import { propertyTypes } from 'deals/utils/property-types'

function getItems(items) {
  return items.map(item => ({ label: item, value: item }))
}
function itemToString(item) {
  return item.label
}

export default ({ selectedType, onChangeDealType }) => (
  <div className="form-section deal-type">
    <H2 className="hero">
      Select a checklist type. <span className="required">*</span>
    </H2>

    <BasicDropdown
      maxHeight="unset"
      style={{ display: 'inline-block' }}
      items={getItems(propertyTypes)}
      itemToString={itemToString}
      buttonText={selectedType || 'Choose a checklist type'}
      onChange={item => onChangeDealType(item.value)}
    />
  </div>
)
