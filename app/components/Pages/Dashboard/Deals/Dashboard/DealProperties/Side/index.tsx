import { useDispatch } from 'react-redux'

import { Button, MenuItem, makeStyles, Theme } from '@material-ui/core'

import { mdiChevronDown } from '@mdi/js'

import Deal from 'models/Deal'
import { upsertContexts } from 'actions/deals'
import { createUpsertObject } from 'models/Deal/helpers/dynamic-context'
import { getEnderType } from 'models/Deal/helpers/context'
import { BaseDropdown } from 'components/BaseDropdown'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
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

export function DealSide(props: Props) {
  const classes = useStyles()
  const dispatch = useDispatch()

  const options = [
    {
      value: null,
      label: props.deal.deal_type
    },
    {
      value: 'AgentDoubleEnder',
      label: `${props.deal.deal_type} (Agent Double Ender)`
    },
    {
      value: 'OfficeDoubleEnder',
      label: `${props.deal.deal_type} (Office Double Ender)`
    }
  ]

  const enderType = Deal.get.field(props.deal, 'ender_type')
  const sideName = getEnderType(props.deal)

  const handleSelectEnderType = (value: string | null) => {
    if (value === enderType) {
      return false
    }

    dispatch(
      upsertContexts(props.deal.id, [
        createUpsertObject(props.deal, 'ender_type', value, true)
      ])
    )
  }

  if (props.isBackOffice === false) {
    return <ItemValue>{sideName}</ItemValue>
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
          {sideName}
        </Button>
      )}
      renderMenu={({ close }) => (
        <div>
          {options.map((item, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                close()
                handleSelectEnderType(item.value)
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
