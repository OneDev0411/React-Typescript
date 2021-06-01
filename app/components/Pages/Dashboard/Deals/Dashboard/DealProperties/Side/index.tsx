import { useDispatch, useSelector } from 'react-redux'

import { Button, MenuItem, makeStyles, Theme } from '@material-ui/core'

import { mdiChevronDown } from '@mdi/js'

import Deal from 'models/Deal'
import { upsertContexts } from 'actions/deals'
import { createContextObject } from 'models/Deal/helpers/brand-context/create-context-object'
import { getEnderType } from 'models/Deal/helpers/context'
import { IAppState } from 'reducers'
import { getDealChecklists } from 'reducers/deals/checklists'

import { BaseDropdown } from 'components/BaseDropdown'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

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

export function DealSide(props: Props) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const checklists = useSelector<IAppState, IDealChecklist[]>(({ deals }) =>
    getDealChecklists(props.deal, deals.checklists)
  )

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
        createContextObject(props.deal, checklists, 'ender_type', value, true)
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
