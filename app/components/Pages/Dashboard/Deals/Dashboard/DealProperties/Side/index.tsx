import { useMemo } from 'react'

import { Button, MenuItem, makeStyles, Theme } from '@material-ui/core'
import { mdiChevronDown } from '@mdi/js'
import { useDispatch, useSelector } from 'react-redux'

import { upsertContexts } from 'actions/deals'
import { BaseDropdown } from 'components/BaseDropdown'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { createContextObject } from 'models/Deal/helpers/brand-context/create-context-object'
import { getEnderType, getField } from 'models/Deal/helpers/context'
import { IAppState } from 'reducers'
import { getBrandChecklistsById } from 'reducers/deals/brand-checklists'
import { getDealChecklists } from 'reducers/deals/checklists'

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
  const { checklists, brandChecklists } = useSelector(
    ({ deals }: IAppState) => ({
      brandChecklists: getBrandChecklistsById(
        deals.brandChecklists,
        props.deal.brand.id
      ),
      checklists: getDealChecklists(props.deal, deals.checklists)
    })
  )

  const dealType = props.deal.deal_type

  const options = useMemo(() => {
    return [
      {
        value: null,
        label: dealType,
        isAvailable: true
      },
      {
        value: 'AgentDoubleEnder',
        label: `${dealType} (Agent Double Ender)`,
        isAvailable: dealType === 'Selling'
      },
      {
        value: 'OfficeDoubleEnder',
        label: `${dealType} (Office Double Ender)`,
        isAvailable: true
      }
    ].filter(option => option.isAvailable)
  }, [dealType])

  const enderType = getField(props.deal, 'ender_type')
  const sideName = getEnderType(props.deal)

  const handleSelectEnderType = (value: string | null) => {
    if (value === enderType) {
      return false
    }

    dispatch(
      upsertContexts(props.deal.id, [
        createContextObject(
          props.deal,
          brandChecklists,
          checklists,
          'ender_type',
          value,
          true
        )
      ])
    )
  }

  if (props.isBackOffice === false) {
    return <ItemValue>{sideName}</ItemValue>
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
