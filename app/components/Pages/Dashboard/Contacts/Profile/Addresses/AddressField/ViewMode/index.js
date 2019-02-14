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

export function ViewMode({ address, toggleMode, handleAddNew }) {
  return (
    <Container onClick={toggleMode}>
      <Label>
        {address.label || 'Home'}
        {address.is_primary && (
          <Tooltip caption="Primary">
            <Star />
          </Tooltip>
        )}
      </Label>
      <Address>{address.full_address || '-'}</Address>
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
