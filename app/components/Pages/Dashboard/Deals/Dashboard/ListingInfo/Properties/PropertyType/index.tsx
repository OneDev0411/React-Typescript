import React from 'react'
import { useDispatch } from 'react-redux'
import { MenuItem } from '@material-ui/core'

import { updatePropertyType } from 'actions/deals'

import { BaseDropdown } from 'components/BaseDropdown'

import { propertyTypes } from 'deals/utils/property-types'

interface Props {
  deal: IDeal
  isBackOffice: boolean
}

export function PropertyType(props: Props) {
  const dispatch = useDispatch()

  const handleChange = async (value: string) => {
    try {
      dispatch(updatePropertyType(props.deal.id, value))
    } catch (e) {
      console.log(e)
    }
  }

  if (!props.isBackOffice) {
    return <span>{props.deal.property_type}</span>
  }

  return (
    <BaseDropdown
      buttonLabel={props.deal.property_type}
      renderMenu={({ close }) => (
        <div>
          {propertyTypes.map((value, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                close()
                handleChange(value)
              }}
            >
              {value}
            </MenuItem>
          ))}
        </div>
      )}
    />
  )
}
