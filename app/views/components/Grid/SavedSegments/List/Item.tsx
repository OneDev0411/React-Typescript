import React, { useContext, useCallback } from 'react'

import { uppercaseFirstLetter } from 'utils/helpers'

import Badge from 'components/Badge'
import IconClose from 'components/SvgIcons/Close/CloseIcon'
import ConfirmationModalContext from 'components/ConfirmationModal/context'
import {
  ListItem,
  ListItemName,
  DeleteButton
} from 'components/SlideMenu/Menu/styled'

interface Props {
  item: ISavedSegment
  deleteHandler: (item: ISavedSegment) => void
  selectHandler: (item: ISavedSegment) => void
  selected: boolean
}
function Item(props: Props) {
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
    <ListItem
      isSelected={selected}
      onClick={onSelect}
      data-test={`contact-list-${item.name}`}
    >
      <ListItemName>
        {uppercaseFirstLetter(name)}
        {item.badge && (
          <Badge large style={{ marginLeft: '0.5rem' }}>
            {item.badge}
          </Badge>
        )}
      </ListItemName>
      {item.is_editable && (
        <DeleteButton data-test="delete-list" onClick={onDelete} isFit>
          <IconClose />
        </DeleteButton>
      )}
    </ListItem>
  )
}

export default Item
