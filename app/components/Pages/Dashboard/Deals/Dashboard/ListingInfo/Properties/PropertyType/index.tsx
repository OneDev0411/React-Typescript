import { useDispatch, useSelector } from 'react-redux'
import { MenuItem } from '@material-ui/core'

import { updatePropertyType } from 'actions/deals'

import { BaseDropdown } from 'components/BaseDropdown'
import { useBrandPropertyTypes } from 'hooks/use-get-brand-property-types'
import { selectUser } from 'selectors/user'
import { getActiveTeamId } from 'utils/user-teams'

interface Props {
  deal: IDeal
  isBackOffice: boolean
}

export function PropertyType(props: Props) {
  const dispatch = useDispatch()

  const user = useSelector(selectUser)
  const { propertyTypes } = useBrandPropertyTypes(getActiveTeamId(user)!)

  const handleChange = async (value: string) => {
    try {
      dispatch(updatePropertyType(props.deal.id, value))
    } catch (e) {
      console.log(e)
    }
  }

  if (!props.isBackOffice) {
    return <span>{props.deal.property_type.label}</span>
  }

  return (
    <BaseDropdown
      buttonLabel={props.deal.property_type.label}
      renderMenu={({ close }) => (
        <div>
          {propertyTypes.map((item, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                close()
                handleChange(item.id)
              }}
            >
              {item.label}
            </MenuItem>
          ))}
        </div>
      )}
    />
  )
}
