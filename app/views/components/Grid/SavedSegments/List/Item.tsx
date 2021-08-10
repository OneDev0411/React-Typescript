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
import { mdiClose } from '@mdi/js'

import Badge from 'components/Badge'
import ConfirmationModalContext from 'components/ConfirmationModal/context'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { uppercaseFirstLetter } from 'utils/helpers'

interface Props {
  item: ISavedSegment
  deleteHandler: (item: ISavedSegment) => void
  selectHandler: (item: ISavedSegment) => void
  closeHandler: () => void
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
    },
    textItem: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      ...theme.typography.body2
    }
  })
)

function Item(props: Props) {
  const classes = useStyles()
  const { item, selectHandler, deleteHandler, closeHandler, selected } = props
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
    closeHandler()
  }, [selected, selectHandler, item, closeHandler])

  return (
    <ListItem
      button
      classes={{ container: classes.container }}
      selected={selected}
      onClick={onSelect}
    >
      <ListItemText disableTypography className={classes.textItem}>
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
            <SvgIcon path={mdiClose} />
          </IconButton>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default Item
