import React from 'react'

import { Button } from '@material-ui/core'
import { Form } from 'react-final-form'

import Drawer from 'components/OverlayDrawer'

import { Recipients } from './form/Recipients'
import { From } from './form/From'
import { Subject } from './form/Subject'
import { Message } from './form/Message'
import { Attachments } from './form/Attachments'
import { AutoNotify } from './form/AutoNotify'

interface Props {
  user: IUser
  deal: IDeal
  attachments: IDealFile[]
  isOpen: boolean
  isSubmitting: boolean
  onSubmit: () => void
  onClose: () => void
}

export function SignatureComposeDrawer({
  deal,
  user,
  attachments,
  isOpen,
  isSubmitting,
  onClose
}: Props) {
  return (
    <Drawer open={isOpen} onClose={onClose}>
      <Drawer.Header title="Send for Signatures" />

      <Form
        onSubmit={() => {}}
        initialValues={{
          subject: 'Please DocuSign',
          from: `${user.display_name} <${user.email}>`,
          recipients: {},
          auto_notify: true,
          attachments
        }}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Drawer.Body>
              <Recipients deal={deal} />
              <From />
              <Subject />
              <Message />
              <Attachments />
            </Drawer.Body>

            <Drawer.Footer>
              <AutoNotify />
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                disabled={isSubmitting}
                onClick={() => {}}
              >
                {isSubmitting ? 'Please Wait...' : 'Next: View in Docusign'}
              </Button>
            </Drawer.Footer>
          </form>
        )}
      />
    </Drawer>
  )
}
