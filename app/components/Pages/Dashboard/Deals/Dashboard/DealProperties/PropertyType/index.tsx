import { useDispatch } from 'react-redux'
import { Button, MenuItem } from '@material-ui/core'

import { updatePropertyType } from 'actions/deals'

import { BaseDropdown } from 'components/BaseDropdown'

import { propertyTypes } from 'deals/utils/property-types'

import { ItemValue } from '../../Factsheet/styled'

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
    return <ItemValue>{props.deal.property_type}</ItemValue>
  }

  return (
    <BaseDropdown
      renderDropdownButton={buttonProps => (
        <Button
          {...buttonProps}
          size="small"
          style={{
            padding: 0,
            minWidth: 'auto'
          }}
        >
          {props.deal.property_type}
        </Button>
      )}
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
