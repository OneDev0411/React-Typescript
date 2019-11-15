import React from 'react'
import { connect } from 'react-redux'

import { updatePropertyType } from 'actions/deals'

import { BasicDropdown } from 'components/BasicDropdown'

import { propertyTypes } from 'deals/utils/property-types'

const Options = propertyTypes.map(value => ({
  value,
  label: value
}))

function ChecklistType(props) {
  if (!props.isBackOffice) {
    return props.deal.property_type
  }

  const handleChange = async item => {
    try {
      await props.updatePropertyType(props.deal.id, item.value)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <BasicDropdown
      noBorder
      fullHeight
      buttonStyle={{
        padding: 0,
        margin: 0
      }}
      items={Options}
      selectedItem={Options.find(
        item => item.value === props.deal.property_type
      )}
      onSelect={handleChange}
    />
  )
}

export default connect(
  null,
  {
    updatePropertyType
  }
)(ChecklistType)
