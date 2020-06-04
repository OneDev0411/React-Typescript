import React, { useContext } from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'

import Tooltip from 'components/tooltip'
import IconDeleteOutline from 'components/SvgIcons/DeleteOutline/IconDeleteOutline'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

interface Props {
  name: String
  context: IDealBrandContext
  onSelect: () => void
  onDelete: () => void
}

function ContextItem({ name, onSelect, onDelete }: Props) {
  const modal = useContext(ConfirmationModalContext)

  return (
    <ListItem>
      <ListItemText primary={name} onClick={onSelect} />
      <ListItemSecondaryAction>
        <Tooltip caption="Delete">
          <IconButton
            size="small"
            aria-label="delete"
            onClick={e => {
              e.stopPropagation()
              modal.setConfirmationModal({
                message: 'Delete Context!',
                description: `Are you sure about deleting "${name}" context?`,
                confirmLabel: 'Yes, I am sure',
                onConfirm: () => onDelete()
              })
            }}
          >
            <IconDeleteOutline
              style={{ fill: 'currentColor', width: 16, height: 16 }}
            />
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default ContextItem
