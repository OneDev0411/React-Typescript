import { useDispatch } from 'react-redux'
import { Button, MenuItem, makeStyles, Theme } from '@material-ui/core'

import { mdiChevronDown } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { updatePropertyType } from 'actions/deals'
import { BaseDropdown } from 'components/BaseDropdown'
import { propertyTypes } from 'deals/utils/property-types'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import { ItemValue } from '../../Factsheet/styled'

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    padding: theme.spacing(0, 0, 0, 0.25),
    minWidth: 'auto',
    color: theme.palette.grey['600'],
    '&:hover': {
      color: '#000'
    }
  }
}))

interface Props {
  deal: IDeal
  isBackOffice: boolean
}

export function PropertyType(props: Props) {
  const classes = useStyles()
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
          className={classes.button}
          endIcon={<SvgIcon path={mdiChevronDown} size={muiIconSizes.small} />}
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
