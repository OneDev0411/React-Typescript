import React from 'react'

import CloseIcon from 'components/SvgIcons/RemoveCircleOutline/IconRemoveCircleOutline'

import { ItemActions, ActionButton, DeleteButton } from '../styled'

export default function Actions(props) {
  return (
    <ItemActions>
      <ActionButton onClick={() => props.onClickEditContext(props.field)}>
        Edit
      </ActionButton>

      <DeleteButton
        iconSize="large"
        isFit
        onClick={() => props.onClickRemoveContext(props.field)}
      >
        <CloseIcon />
      </DeleteButton>
    </ItemActions>
  )
}
