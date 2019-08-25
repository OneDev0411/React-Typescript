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
  submitCallback?: (emailTemplate: IBrandEmailTemplate) => void
  activeTeamId: string
  /**
   * If not provided, It is in "Add" mode.
   */
  emailTemplate?: IBrandEmailTemplate | null
  updateEmailTemplate: IAsyncActionProp<typeof updateEmailTemplate>
  createEmailTemplate: IAsyncActionProp<typeof createEmailTemplate>
  addNotification: typeof addNotification
}

function AddOrEditEmailTemplateDrawer({
  isOpen,
  onClose,
  submitCallback,
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
    const template: Partial<IBrandEmailTemplateInput> = emailTemplate || {}

    setFormData({
      subject: template.subject || '',
      name: template.name || '',
      include_signature: template.include_signature || false,
      goal: template.goal || '',
      body: template.body || ''
    })
  }, [emailTemplate])

  const handleSubmit = async (values: IBrandEmailTemplateInput) => {
    try {
      const resultEmailTemplate = emailTemplate
        ? await updateEmailTemplate(
            emailTemplate.brand,
            emailTemplate.id,
            values
          )
        : await createEmailTemplate(activeTeamId, values)

      if (submitCallback) {
        submitCallback(resultEmailTemplate)
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

  const getTitle = () => {
    const title = 'Email Template'

    if (emailTemplate) {
      return emailTemplate.editable ? `Edit ${title}` : title
    }

    return `New ${title}`
  }

  const editable = !emailTemplate || emailTemplate.editable

  return (
    <FinalFormDrawer
      formId="email-template-form"
      disableSubmitByEnter
      isOpen={isOpen}
      initialValues={formData}
      onClose={onClose}
      onSubmit={handleSubmit}
      closeDrawerOnBackdropClick={false}
      submitButtonLabel="Save"
      submittingButtonLabel="Saving ..."
      title={getTitle()}
      isSubmitDisabled={!editable}
      submitButtonTooltip={!editable ? "Template isn't editable!" : 'Save'}
      render={() => (
        <div>
          <Field
            name="name"
            component={TextField}
            margin="dense"
            validate={value => !value && 'Template name is required'}
            required
            fullWidth
            disabled={!editable}
            InputProps={{
              startAdornment: <InlineInputLabel>Name</InlineInputLabel>,
              inputProps: {}
            }}
          />
          <Field
            name="subject"
            component={TextField}
            fullWidth
            disabled={!editable}
            InputProps={{
              startAdornment: <InlineInputLabel>Subject</InlineInputLabel>,
              inputProps: {}
            }}
          />
          <EmailBody
            ref={emailBodyRef}
            hasSignatureByDefault
            hasTemplateVariables
            hasStaticBody={!editable}
            FieldProps={{
              validate: value => !value && 'Email content is required'
            }}
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
