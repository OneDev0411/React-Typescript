import React from 'react'

import Tooltip from 'components/tooltip'
import IconButton from 'components/Button/IconButton'
import AddIcon from 'components/SvgIcons/AddCircleOutline/IconAddCircleOutline'

import {
  Container,
  Label,
  Star,
  Address,
  ActionBar,
  EditButton
} from './styled'

export function ViewMode({ field, toggleMode, handleAddNew }) {
  return (
    <Container onClick={toggleMode}>
      <Label>
        {field.label || 'Home'}
        {field.is_primary && (
          <Tooltip caption="Primary">
            <Star />
          </Tooltip>
        )}
      </Label>
      <Address>{field.full_address || '-'}</Address>
      <ActionBar className="action-bar">
        <IconButton isFit onClick={handleAddNew}>
          <AddIcon />
        </IconButton>
        <EditButton appearance="link" onClick={toggleMode}>
          Edit
        </EditButton>
      </ActionBar>
    </Container>
  )
}
