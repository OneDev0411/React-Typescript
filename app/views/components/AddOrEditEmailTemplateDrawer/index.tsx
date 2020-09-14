import React, { useState, useEffect, useContext } from 'react'
import { Field } from 'react-final-form'
import { TextField } from 'final-form-material-ui'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import useDeepCompareEffect from 'react-use/lib/useDeepCompareEffect'
import { addNotification } from 'reapop'

import { updateEmailTemplate } from 'actions/email-templates/update-email-template'
import { createEmailTemplate } from 'actions/email-templates/create-email-template'
import { IAppState } from 'reducers'
import { getActiveTeamId } from 'utils/user-teams'
import { useEditorState } from 'components/TextEditor/hooks/use-editor-state'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

import { InlineInputLabel } from '../InlineInputLabel'
import EmailBody from '../EmailCompose/components/EmailBody'
import { FinalFormDrawer } from '../FinalFormDrawer'

interface Props {
  isOpen: boolean
  onClose: () => void
  submitCallback?: (emailTemplate: IBrandEmailTemplate) => void
  activeTeamId: string
  /**
   * If null or not provided, It is in "Add" mode.
   */
  emailTemplate?: IBrandEmailTemplate | null
  updateEmailTemplate: IAsyncActionProp<typeof updateEmailTemplate>
  createEmailTemplate: IAsyncActionProp<typeof createEmailTemplate>
  addNotification: IAsyncActionProp<typeof addNotification>
}

export function AddOrEditEmailTemplateDrawer({
  isOpen,
  onClose,
  submitCallback,
  emailTemplate,
  updateEmailTemplate,
  createEmailTemplate,
  addNotification,
  activeTeamId
}: Props) {
  const [formData, setFormData] = useState<
    Omit<IBrandEmailTemplateInput, 'body'>
  >({
    name: '',
    subject: '',
    goal: '',
    include_signature: false
  })

  const [editorState, setEditorState, bodyEditor] = useEditorState(
    (emailTemplate && emailTemplate.body) || ''
  )

  useEffect(() => () => bodyEditor.reset(), [isOpen])

  useDeepCompareEffect(() => {
    const template: Partial<IBrandEmailTemplateInput> = emailTemplate || {}

    setFormData({
      subject: template.subject || '',
      name: template.name || '',
      include_signature: template.include_signature || false,
      goal: template.goal || ''
    })
    bodyEditor.reset(template.body || '')
  }, [emailTemplate])

  const confirmationModal = useContext(ConfirmationModalContext)

  const handleSubmit = async (values: IBrandEmailTemplateInput) => {
    const bodyText = bodyEditor.getPlainText()
    const bodyTestIsEmpty = !bodyText || /^[\s\n]*$/.test(bodyText)

    if (bodyTestIsEmpty) {
      confirmationModal.setConfirmationModal({
        message: 'Email template body is empty',
        description:
          'Email template body can not be empty or consisting from only spaces and new lines.',
        cancelLabel: 'Ok',
        needsConfirm: false
      })

      return
    }

    const enhancedValues: typeof values = {
      ...values,
      body: bodyEditor.getHtml()
    }

    try {
      const resultEmailTemplate = emailTemplate
        ? await updateEmailTemplate(
            emailTemplate.brand,
            emailTemplate.id,
            enhancedValues
          )
        : await createEmailTemplate(activeTeamId, enhancedValues)

      if (submitCallback) {
        submitCallback(resultEmailTemplate)
      }

      onClose()
    } catch (error) {
      console.error('[EditTemplate]: ', error)
      addNotification({
        message: error.message || 'Could not save email template',
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
      width="43rem"
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
            validate={value =>
              !(value || '').trim() && 'Template name is required'
            }
            required
            fullWidth
            disabled={!editable}
            InputProps={{
              startAdornment: <InlineInputLabel>Name</InlineInputLabel>,
              inputProps: {
                'data-test': 'template-name-input'
              }
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
            hasSignatureByDefault
            hasTemplateVariables
            hasStaticBody={!editable}
            content={emailTemplate ? emailTemplate.body : ''}
            editorState={editorState}
            onChangeEditor={setEditorState}
            stateFromHtmlOptions={bodyEditor.stateFromHtmlOptions}
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
    addNotification: (...args: Parameters<typeof addNotification>) =>
      dispatch(addNotification(...args))
  }
}

export default connect(
  (state: IAppState) => ({
    activeTeamId: getActiveTeamId(state.user)
  }),
  mapDispatchToProps
)(AddOrEditEmailTemplateDrawer)

// TODO: EDITOR ERROR
// FieldProps={{
//   validate: value => !value && 'Email content is required'
// }}
