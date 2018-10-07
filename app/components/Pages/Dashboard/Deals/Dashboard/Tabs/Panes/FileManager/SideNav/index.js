import React from 'react'

import ActionButton from 'components/Button/ActionButton'

import { SidebarContainer, DraggableArea, Divider } from './styled'
import { Card } from '../../../styled'

export default function FileManagerPane({ deal }) {
  return (
    <SidebarContainer>
      <Card style={{ padding: '1.5rem 0.5rem' }}>
        <DraggableArea>
          <ActionButton
            style={{ justifyContent: 'center', marginBottom: '0.5rem' }}
          >
            Upload files
          </ActionButton>
          or Drag n Drop them to the page
        </DraggableArea>

        <Divider />
      </Card>
    </SidebarContainer>
  )
}
