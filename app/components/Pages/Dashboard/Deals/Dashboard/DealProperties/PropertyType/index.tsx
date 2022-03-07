import { Button, MenuItem, makeStyles, Theme } from '@material-ui/core'
import { mdiChevronDown } from '@mdi/js'
import { useDispatch } from 'react-redux'

import { useActiveBrandId } from '@app/hooks/brand/use-active-brand-id'
import { updatePropertyType } from 'actions/deals'
import { BaseDropdown } from 'components/BaseDropdown'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { useBrandPropertyTypes } from 'hooks/use-get-brand-property-types'

import { ItemValue } from '../../Factsheet/styled'

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    padding: 0,
    minWidth: 'auto',
    color: theme.palette.grey['600'],
    '&:hover': {
      background: 'transparent',
      color: '#000'
    }
  }
}))

interface Props {
  deal: IDeal
  isBackOffice: boolean
}

export function PropertyType(props: Props) {
  const dispatch = useDispatch()
  const classes = useStyles()
  const activeBrandId = useActiveBrandId()

  const { propertyTypes } = useBrandPropertyTypes(activeBrandId)

  const handleChange = async (value: string) => {
    try {
      dispatch(updatePropertyType(props.deal.id, value))
    } catch (e) {
      console.log(e)
    }
  }

  if (!props.isBackOffice) {
    return <ItemValue>{props.deal.property_type?.label}</ItemValue>
  }

  return (
    <BaseDropdown
      renderDropdownButton={({ isActive, ...buttonProps }) => (
        <Button
          {...buttonProps}
          size="small"
          className={classes.button}
          endIcon={<SvgIcon path={mdiChevronDown} size={muiIconSizes.small} />}
        >
          {props.deal.property_type?.label}
        </Button>
      )}
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
