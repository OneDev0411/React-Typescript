import React, { useContext, useCallback } from 'react'

import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  createStyles,
  makeStyles,
  Theme
} from '@material-ui/core'

import { uppercaseFirstLetter } from 'utils/helpers'

import Badge from 'components/Badge'
import IconClose from 'components/SvgIcons/Close/CloseIcon'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

interface Props {
  item: ISavedSegment
  deleteHandler: (item: ISavedSegment) => void
  selectHandler: (item: ISavedSegment) => void
  selected: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      '& .MuiListItemSecondaryAction-root': {
        display: 'none'
      },
      '&:hover .MuiListItemSecondaryAction-root': {
        display: 'block'
      }
    }
  })
)

function Item(props: Props) {
  const classes = useStyles()
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
      dense
      button
      classes={{ container: classes.container }}
      selected={selected}
      onClick={onSelect}
    >
      <ListItemText>
        {uppercaseFirstLetter(name)}
        {item.badge && (
          <Badge large style={{ marginLeft: '0.5rem' }}>
            {item.badge}
          </Badge>
        )}
      </ListItemText>
      <ListItemSecondaryAction>
        {item.is_editable && (
          <IconButton size="small" aria-label="delete" onClick={onDelete}>
            <IconClose
              style={{ fill: 'currentColor', width: 16, height: 16 }}
            />
          </IconButton>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default Item
