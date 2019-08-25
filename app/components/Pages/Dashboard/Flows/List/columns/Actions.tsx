import React from 'react'

import VerticalDotsIcon from 'components/SvgIcons/MoreVert/IconMoreVert'
import { BasicDropdown } from 'components/BasicDropdown'

import { FlowAction } from '../types'

import { ActionsContainer } from './styled'

interface Props {
  actions: FlowAction[]
  onSelect: (action: FlowAction) => void
}

export default function Actions({ actions, onSelect }: Props) {
  return (
    <ActionsContainer>
      <BasicDropdown
        fullHeight
        pullTo="right"
        selectedItem={null}
        buttonRenderer={(btnProps: any) => <VerticalDotsIcon {...btnProps} />}
        items={actions}
        onSelect={onSelect}
      />
    </ActionsContainer>
  )
}
