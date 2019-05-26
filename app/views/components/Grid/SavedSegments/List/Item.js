import React, { useContext, useCallback } from 'react'

import { uppercaseFirstLetter } from 'utils/helpers'

import ToolTip from 'components/tooltip'
import IconClose from 'components/SvgIcons/Close/CloseIcon'
import ConfirmationModalContext from 'components/ConfirmationModal/context'
import {
  ListItem,
  ListItemName,
  DeleteButton
} from 'components/SlideMenu/Menu/styled'

function Item(props) {
  const { item, selectHandler, deleteHandler, selected } = props
  const { name } = item
  const modal = useContext(ConfirmationModalContext)

  const onDelete = useCallback(
    event => {
      modal.setConfirmationModal({
        message: `Delete '${name}'?`,
        confirmLabel: 'Yes',
        onConfirm: () => deleteHandler(item)
      })
      event.stopPropagation()
    },
    [deleteHandler, item, modal, name]
  )

  const onSelect = useCallback(() => {
    if (selected) {
      return false
    }

    selectHandler(item)
  }, [selected, selectHandler, item])

  return (
    <ToolTip caption={name} placement="right">
      <ListItem
        isDeleting={props.isDeleting}
        isSelected={selected}
        onClick={onSelect}
      >
        <ListItemName>{uppercaseFirstLetter(name)}</ListItemName>
        {item.is_editable && (
          <DeleteButton onClick={onDelete} isFit>
            <IconClose />
          </DeleteButton>
        )}
      </ListItem>
    </ToolTip>
  )
}

export default Item
