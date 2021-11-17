import { useRef } from 'react'

import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Form, FormSpy } from 'react-final-form'

import Drawer from 'components/OverlayDrawer'
import { SET_FORM_META } from 'deals/contexts/actions-context/constants'
import { useChecklistActionsContext } from 'deals/contexts/actions-context/hooks'

import type { FormValues } from '../types'

import { Attachments } from './form/Attachments'
import { From } from './form/From'
import { Message } from './form/Message'
import { Recipients } from './form/Recipients'
import { Subject } from './form/Subject'
import { SubmitButton } from './form/SubmitButton'

interface Props {
  user: IUser
  deal: IDeal
  isOpen: boolean
  isSubmitting: boolean
  defaultAttachments?: IDealFile[]
  onClickAddAttachments: () => void
  onSubmit: (form: FormValues) => Promise<void>
  onClose: () => void
}

const useStyles = makeStyles(
  () => ({
    form: {
      display: 'flex',
      flexDirection: 'column',
      flexBasis: '100%',
      maxHeight: '90%'
    },
    footer: {
      position: 'sticky',
      bottom: 0,
      background: '#fff',
      width: '100%'
    }
  }),
  {
    name: 'DocusignDrawer'
  }
)
export function SignatureComposeDrawer({
  deal,
  user,
  isOpen,
  isSubmitting,
  defaultAttachments,
  onClickAddAttachments,
  onSubmit,
  onClose
}: Props) {
  const [actionsState, actionsDispatch] = useChecklistActionsContext()
  const initialValues = useRef<FormValues | null>(null)
  const classes = useStyles()

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

    const attachments = defaultAttachments ?? actionsState.attachments

    if (!initialValues.current && actionsState.form) {
      initialValues.current = {
        ...(actionsState.form as FormValues),
        attachments
      }

      return initialValues.current
    }

    initialValues.current = {
      subject: 'Please DocuSign',
      message: '',
      owner: user,
      recipients: {},
      auto_notify: true,
      attachments
    }

    return initialValues.current
  }

  const handleChangeForm = ({ values }) => {
    initialValues.current = values as FormValues
  }

  const handleClickAddAttachments = () => {
    actionsDispatch({
      type: SET_FORM_META,
      form: initialValues.current ?? undefined
    })

    onClickAddAttachments()
  }

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <Drawer.Header title="Send for Signatures" />

      <Form
        onSubmit={onSubmit}
        initialValues={getInitialValues()}
        validate={validate}
        render={({ handleSubmit, valid }) => (
          <form className={classes.form}>
            <FormSpy
              subscription={{ values: true }}
              onChange={handleChangeForm}
            />

            <Drawer.Body>
              <From deal={deal} />
              <Recipients deal={deal} />
              <Subject />
              <Message />
              <Attachments
                isSubmitting={isSubmitting}
                onClickAddAttachments={handleClickAddAttachments}
              />
            </Drawer.Body>

            <Drawer.Footer>
              <div className={classes.footer}>
                <Box display="flex" flexDirection="row-reverse">
                  <SubmitButton
                    deal={deal}
                    isSubmitting={isSubmitting}
                    valid={valid}
                    onSubmit={handleSubmit}
                  />
                </Box>
              </div>
            </Drawer.Footer>
          </form>
        )}
      />
    </Drawer>
  )
}
