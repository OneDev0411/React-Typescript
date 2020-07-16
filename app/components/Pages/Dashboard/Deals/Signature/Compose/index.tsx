import React, { useRef } from 'react'

import { Button, Box } from '@material-ui/core'
import { Form } from 'react-final-form'

import Drawer from 'components/OverlayDrawer'

import { useChecklistActionsContext } from 'deals/contexts/actions-context/hooks'

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
  onClickAddAttachments: () => void
  onSubmit: (form: FormValues) => Promise<void>
  onClose: () => void
}

export function SignatureComposeDrawer({
  deal,
  user,
  attachments,
  isOpen,
  isSubmitting,
  onClickAddAttachments,
  onSubmit,
  onClose
}: Props) {
  const [actionsState] = useChecklistActionsContext()
  const initialValues = useRef<FormValues | null>(null)

  const getAttchments = () => {
    if (actionsState.attachments.length > 0) {
      return actionsState.attachments
    }

    return attachments
  }

  const validate = (values: FormValues) => {
    const errors: Record<string, string> = {}

    if (Object.values(values.recipients).length === 0) {
      errors.recipients = 'Select one recipient at least'
    }

    if (!values.subject) {
      errors.subject = 'Enter email subject'
    }

    if (Object.values(values.attachments).length === 0) {
      errors.attachments = 'Select one attachment at least'
    }

    return errors
  }

  const getInitialValues = () => {
    if (initialValues.current || isSubmitting) {
      return initialValues.current
    }

    initialValues.current = {
      subject: 'Please DocuSign',
      message: '',
      owner: user,
      recipients: {},
      auto_notify: true,
      attachments: getAttchments()
    }

    return initialValues.current
  }

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <Drawer.Header title="Send for Signatures" />

      <Form
        onSubmit={onSubmit}
        initialValues={getInitialValues()}
        validate={validate}
        render={({ handleSubmit, pristine }) => (
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              flexBasis: '100%',
              maxHeight: '100%'
            }}
          >
            <Drawer.Body>
              <From deal={deal} />
              <Recipients deal={deal} />
              <Subject />
              <Message />
              <Attachments onClickAddAttachments={onClickAddAttachments} />
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
                    disabled={isSubmitting || pristine}
                  >
                    {isSubmitting ? 'Please Wait...' : 'Next: View in Docusign'}
                  </Button>
                  <AutoNotify disabled={isSubmitting} />
                </Box>
              </div>
            </Drawer.Footer>
          </form>
        )}
      />
    </Drawer>
  )
}
