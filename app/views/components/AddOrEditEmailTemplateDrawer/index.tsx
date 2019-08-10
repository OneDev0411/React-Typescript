import * as React from 'react'
import { useRef, useState } from 'react'
import { Field } from 'react-final-form'
import { TextField } from 'final-form-material-ui'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import useDeepCompareEffect from 'react-use/lib/useDeepCompareEffect'
import { addNotification } from 'reapop'

import { updateEmailTemplate } from 'actions/email-templates/update-email-template'
import { createEmailTemplate } from 'actions/email-templates/create-email-template'
import { IAppState } from 'reducers/index'
import { getActiveTeamId } from 'utils/user-teams'

import { InlineInputLabel } from '../InlineInputLabel'
import EmailBody from '../EmailCompose/components/EmailBody'
import { FinalFormDrawer } from '../FinalFormDrawer'

interface Props {
  isOpen: boolean
  onClose: () => void
  activeTeamId: string
  /**
   * If not provided, It in "Add" mode.
   */
  emailTemplate?: IBrandEmailTemplate
  updateEmailTemplate: IAsyncActionProp<typeof updateEmailTemplate>
  createEmailTemplate: IAsyncActionProp<typeof createEmailTemplate>
  addNotification: typeof addNotification
}

function AddOrEditEmailTemplateDrawer({
  isOpen,
  onClose,
  emailTemplate,
  updateEmailTemplate,
  createEmailTemplate,
  addNotification,
  activeTeamId
}: Props) {
  const emailBodyRef = useRef(null)
  const [formData, setFormData] = useState<IBrandEmailTemplateInput>({
    name: '',
    subject: '',
    body: '',
    goal: '',
    include_signature: false
  })

  useDeepCompareEffect(() => {
    if (emailTemplate) {
      setFormData({
        subject: emailTemplate.subject,
        name: emailTemplate.name,
        include_signature: emailTemplate.include_signature,
        goal: emailTemplate.goal,
        body: emailTemplate.body
      })
    }
  }, [emailTemplate])

  const handleSubmit = async (values: IBrandEmailTemplateInput) => {
    try {
      if (emailTemplate) {
        await updateEmailTemplate(emailTemplate.brand, emailTemplate.id, values)
      } else {
        await createEmailTemplate(activeTeamId, values)
      }

      onClose()
    } catch (e) {
      console.error('[EditTemplate]: ', e)
      addNotification({
        message: e.message || 'Could not save email template',
        status: 'error'
      })
    }
  }

  const validate = () => {}

  return (
    <FinalFormDrawer
      formId="email-template-form"
      disableSubmitByEnter
      isOpen={isOpen}
      initialValues={formData}
      onClose={onClose}
      onSubmit={handleSubmit}
      validate={validate}
      closeDrawerOnBackdropClick={false}
      submitButtonLabel="Save"
      submittingButtonLabel="Saving ..."
      title={emailTemplate ? 'Edit Email Template' : 'New Email Template'}
      render={() => (
        <div>
          <Field
            name="name"
            component={TextField}
            margin="normal"
            fullWidth
            InputProps={{
              startAdornment: <InlineInputLabel>Name</InlineInputLabel>
            }}
          />
          <Field
            name="subject"
            component={TextField}
            margin="normal"
            fullWidth
            InputProps={{
              startAdornment: <InlineInputLabel>Subject</InlineInputLabel>
            }}
          />
          <EmailBody
            ref={emailBodyRef}
            hasSignatureByDefault
            hasTemplateVariables
            content={emailTemplate ? emailTemplate.body : ''}
          />
        </div>
      )}
    />
  )
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  return {
    updateEmailTemplate: (...args: Parameters<typeof updateEmailTemplate>) =>
      dispatch(updateEmailTemplate(...args)),
    createEmailTemplate: (...args: Parameters<typeof createEmailTemplate>) =>
      dispatch(createEmailTemplate(...args)),
    addNotification
  }
}

export default connect(
  (state: IAppState) => ({
    activeTeamId: getActiveTeamId(state.user)
  }),
  mapDispatchToProps
)(AddOrEditEmailTemplateDrawer)
