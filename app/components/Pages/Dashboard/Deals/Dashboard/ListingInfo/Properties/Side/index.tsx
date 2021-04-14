import { useDispatch, useSelector } from 'react-redux'

import { MenuItem } from '@material-ui/core'

import Deal from 'models/Deal'
import { upsertContexts } from 'actions/deals'
import { createContextObject } from 'models/Deal/helpers/brand-context/create-context-object'
import { getEnderType } from 'models/Deal/helpers/context'
import { IAppState } from 'reducers'
import { getDealChecklists } from 'reducers/deals/checklists'

import { BaseDropdown } from 'components/BaseDropdown'

interface Props {
  deal: IDeal
  isBackOffice: boolean
}

function DealSide(props: Props) {
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
    return <span>Side: {sideName}</span>
  }

  return (
    <BaseDropdown
      buttonLabel={sideName}
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

export default DealSide
