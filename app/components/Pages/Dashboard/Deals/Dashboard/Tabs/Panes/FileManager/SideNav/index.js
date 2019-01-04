import React from 'react'

import UploadManager from '../../../../../UploadManager'
import Email from './Email'

import { SidebarContainer, DraggableArea, Divider, FakeButton } from './styled'
import { Card } from '../../../styled'

export default function FileManagerSideNav({ deal }) {
  return (
    <SidebarContainer>
      <Card style={{ padding: '1.5rem 0.5rem' }}>
        <UploadManager deal={deal} disableClick={false}>
          <DraggableArea>
            <FakeButton
              style={{ justifyContent: 'center', marginBottom: '0.5rem' }}
            >
              Upload files
            </FakeButton>
            or Drag n Drop them to the page
          </DraggableArea>
        </UploadManager>

        <Divider />

        <Email deal={deal} />
      </Card>
    </SidebarContainer>
  )
}
