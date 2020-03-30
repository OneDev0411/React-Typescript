import React from 'react'
import { useDispatch } from 'react-redux'

import { MenuItem } from '@material-ui/core'

import Deal from 'models/Deal'
import { upsertContexts } from 'actions/deals'
import { createUpsertObject } from 'models/Deal/helpers/dynamic-context'

import { BaseDropdown } from 'components/BaseDropdown'

interface Props {
  deal: IDeal
  isBackOffice: boolean
}

function DealSide(props: Props) {
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

  const getSideName = () => {
    const dealType = props.deal.deal_type === 'Buying' ? 'Buying' : 'Listing'

    if (enderType === 'AgentDoubleEnder') {
      return 'Both'
    }

    if (enderType === 'OfficeDoubleEnder') {
      return `${dealType} (Office DE)`
    }

    return dealType
  }

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
    return <span>Side: {getSideName()}</span>
  }

  return (
    <BaseDropdown
      buttonLabel={getSideName()}
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
