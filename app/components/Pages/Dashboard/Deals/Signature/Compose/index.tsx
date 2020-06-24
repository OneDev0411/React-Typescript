import React from 'react'

import { Button, Box } from '@material-ui/core'
import { Form } from 'react-final-form'

import Drawer from 'components/OverlayDrawer'

import { useChecklistActionsContext } from 'deals/Dashboard/Folders/actions-context/hooks'

import type { FormValues } from '../types'

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
  onSubmit: (form: FormValues) => Promise<void>
  onClose: () => void
}

export function SignatureComposeDrawer({
  deal,
  user,
  attachments,
  isOpen,
  isSubmitting,
  onSubmit,
  onClose
}: Props) {
  const [actionsState] = useChecklistActionsContext()

  const getAttchments = () => {
    if (actionsState.attachments.length > 0) {
      return actionsState.attachments
    }

    return attachments
  }

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <Drawer.Header title="Send for Signatures" />

      <Form
        onSubmit={onSubmit}
        initialValues={{
          subject: 'Please DocuSign',
          message: '',
          from: `${user.display_name} <${user.email}>`,
          recipients: {},
          auto_notify: true,
          attachments: getAttchments()
        }}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Drawer.Body>
              <Recipients deal={deal} />
              <From />
              <Subject />
              <Message />
              <Attachments onClose={onClose} />
            </Drawer.Body>

            <Drawer.Footer>
              <div
                style={{
                  width: '100%'
                }}
              >
                <Box display="flex" flexDirection="row-reverse">
                  <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    disabled={isSubmitting}
                    onClick={() => {}}
                  >
                    {isSubmitting ? 'Please Wait...' : 'Next: View in Docusign'}
                  </Button>
                  <AutoNotify />
                </Box>
              </div>
            </Drawer.Footer>
          </form>
        )}
      />
    </Drawer>
  )
}
