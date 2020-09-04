import React from 'react'
import { mdiChevronDown } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import ActionButton from '../../../Button/ActionButton'

export function SelectButton(props) {
  return (
    <ActionButton
      {...props}
      appearance="link"
      size="large"
      inverse
      isBlock
      style={{
        justifyContent: 'space-between',
        fontWeight: 500,
        padding: 0
      }}
    >
      {props.selectedItem.label}
      <SvgIcon path={mdiChevronDown} rotate={props.isOpen ? 180 : 0} />
    </ActionButton>
  )
}
