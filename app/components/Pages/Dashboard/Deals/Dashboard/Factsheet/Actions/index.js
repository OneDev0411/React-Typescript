import React from 'react'

import CloseIcon from 'components/SvgIcons/RemoveCircleOutline/IconRemoveCircleOutline'

import { ItemActions, ActionButton, DeleteButton } from '../styled'

export default function Actions(props) {
  const hasValue = props.value || props.value === 0
  const isFieldRequired = props.field.mandatory && !props.deal.is_draft

  return (
    <ItemActions>
      <ActionButton onClick={() => props.onClickEditContext(props.field)}>
        Edit
      </ActionButton>

      {!isFieldRequired && hasValue && (
        <DeleteButton
          iconSize="large"
          isFit
          onClick={() => props.onClickRemoveContext(props.field)}
        >
          <CloseIcon />
        </DeleteButton>
      )}
    </ItemActions>
  )
}
