import React from 'react'

import { Drawer } from '../Drawer'
import { EmailThread } from '../../../EmailThread'
import { DrawerProps } from '../../../OverlayDrawer'

interface Props extends DrawerProps {
  thread: IEmailThread<'messages'>
}

/**
 * A drawer for showing an email thread.
 */
export function EmailThreadDrawer({ thread, ...drawerProps }: Props) {
  return (
    <Drawer {...drawerProps}>
      {drawerProps.open && thread && (
        <EmailThread
          messages={thread.messages}
          subject={thread.subject}
          onClose={drawerProps.onClose}
        />
      )}
    </Drawer>
  )
}
