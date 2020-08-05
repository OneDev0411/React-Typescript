import React, { useContext, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Field, Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import createFocusDecorator from 'final-form-focus'
import { TextField } from 'final-form-material-ui'
import { Box, makeStyles, useTheme } from '@material-ui/core'
import { isEqual } from 'lodash'
import { addNotification as notify } from 'reapop'

import { ClassesProps } from 'utils/ts-utils'

import {
  uploadEmailAttachment,
  UploadOrigin
} from 'models/email/upload-email-attachment'

import {
  GOOGLE_CREDENTIAL,
  MICROSOFT_CREDENTIAL
} from 'constants/oauth-accounts'

import useTypedSelector from 'hooks/use-typed-selector'

import {
  EmailComposeFormProps,
  EmailFormValues,
  EmailComposeValues
} from '../types'
import EmailBody from '../components/EmailBody'
import { AttachmentsList } from '../fields/Attachments'
import { styles } from './styles'
import { Footer } from '../components/Footer'
import ConfirmationModalContext from '../../ConfirmationModal/context'
import { getSendEmailResultMessages } from '../helpers/email-result-messages'
import { TextEditorRef } from '../../TextEditor/types'
import { Callout } from '../../Callout'
import { DangerButton } from '../../Button/DangerButton'
import getTemplateInstancePreviewImage from '../../InstantMarketing/helpers/get-template-preview-image'
import { useEditorState } from '../../TextEditor/hooks/use-editor-state'
import { useEmailFormValidator } from './use-email-form-validator'

export const useEmailFormStyles = makeStyles(styles, { name: 'EmailForm' })

/**
 * Shared parts of the different email compose forms.
 * Currently there are two types of email compose:
 *  - Batch ({@link BulkEmailComposeDrawer})
 *  - Single ({@link SingleEmailComposeDrawer})
 * Difference between these types are:
 * - Different way of sending email (different endpoint and DTOs)
 * - Some UI differences in the input form.
 *
 * These differences are abstracted away from EmailComposeForm
 * as props to be provided by concrete email compose drawer components.
 *
 * UPDATE: We first decided to create separate components for bulk and single
 * email compose. But the way they evolved now can question this and we may
 * need to refactor these BulkXXX, SingleXXX components into a single component
 * Right now there are some duplicate code in them, and the added abstraction
 * is not necessarily worth it.
 */
export default function EmailComposeForm<T>({
  isSubmitDisabled = false,
  onCancel,
  onDelete,
  uploadAttachment = uploadEmailAttachment,
  onSent = () => {},
  onClickAddDealAttachments = () => {},
  onSelectMarketingTemplate,
  disableMarketingTemplates = false,
  children,
  ...props
}: EmailComposeFormProps<T> & ClassesProps<typeof styles>) {
  const user = useTypedSelector<IUser>(({ user }) => user)

  const initialValues: Partial<EmailFormValues> = {
    ...props.initialValues,
    from: props.initialValues?.from ?? user,
    to: props.initialValues?.to ?? [],
    cc: props.initialValues?.cc ?? [],
    bcc: props.initialValues?.bcc ?? [],
    subject: props.initialValues?.subject ?? '',
    body: props.initialValues?.body ?? '',
    attachments: props.initialValues?.attachments ?? []
  }
  const hasRecipients = initialValues.to!.length > 0 && !!initialValues.from
  const hasSubject = !!initialValues.subject
  const autofocusBody = hasRecipients && hasSubject

  const [topFieldsCollapsed, setTopFieldsCollapsed] = useState<boolean>(
    hasRecipients
  )
  const editorRef = useRef<TextEditorRef>(null)
  const [
    marketingTemplate,
    setMarketingTemplate
  ] = useState<IMarketingTemplateInstance | null>(null)

  const dispatch = useDispatch()

  const selectMarketingTemplate: (
    template: IMarketingTemplateInstance | null,
    values: EmailFormValues
  ) => void = (template, values) => {
    const result = onSelectMarketingTemplate?.(template, values)

    if (result === true || result === undefined) {
      return setMarketingTemplate(template)
    }

    result && result.then(result => result && setMarketingTemplate(template))
  }

  const marketingTemplatePreviewHtml = useMemo(
    () =>
      marketingTemplate
        ? getTemplateInstancePreviewImage(marketingTemplate)
        : undefined,
    [marketingTemplate]
  )
  const confirmationModal = useContext(ConfirmationModalContext)
  const validate = useEmailFormValidator()
  const theme = useTheme()

  const classes = useEmailFormStyles(props)

  const [editorState, setEditorState, bodyEditor] = useEditorState(
    initialValues.body
  )

  const handleSendEmail = async (formData: EmailFormValues) => {
    const { successMessage, errorMessage } = getSendEmailResultMessages(
      !!formData.due_at
    )

    let result: T
    let data: EmailComposeValues = formData

    if (marketingTemplate) {
      data = {
        ...data,
        body: marketingTemplate.html,
        template: marketingTemplate.id
      }
    } else {
      data = {
        ...data,
        body: bodyEditor.getHtml()
      }
    }

    try {
      result = await props.sendEmail(data)
    } catch (e) {
      console.error('error in sending email', e)

      return dispatch(
        notify({
          status: 'error',
          message:
            (e.response && e.response.body && e.response.body.message) ||
            errorMessage
        })
      )
    }

    dispatch(
      notify({
        status: 'success',
        message: successMessage
      })
    )

    onSent(result)
  }

  const onSubmit = form => {
    const uploadingAttachment = (form.uploadingAttachments || []).length > 0
    const uploadingImage = bodyEditor.hasUploadingImage()

    if (uploadingImage || uploadingAttachment) {
      return new Promise((resolve, reject) => {
        confirmationModal.setConfirmationModal({
          message: 'Upload in progress',
          description: `Please wait while ${
            uploadingImage ? 'images' : 'attachments'
          } are uploading, or remove them`,
          cancelLabel: 'Ok',
          needsConfirm: false,
          onCancel: reject
        })
      })
    }

    if ((form.uploadingAttachments || []).length > 0) {
      return new Promise((resolve, reject) => {
        confirmationModal.setConfirmationModal({
          message: 'Upload in progress',
          description:
            'Please wait while attachments are uploading, or remove them',
          cancelLabel: 'Ok',
          needsConfirm: false,
          onCancel: reject
        })
      })
    }

    if ((form.subject || '').trim() === '') {
      return new Promise((resolve, reject) => {
        confirmationModal.setConfirmationModal({
          message: 'Send without subject?',
          description:
            'This email has no subject. Are you sure you want to send it?',
          confirmLabel: 'Send anyway',
          onCancel: reject,
          onConfirm: () => {
            handleSendEmail(form).then(resolve).catch(reject)
          }
        })
      })
    }

    return handleSendEmail(form)
  }

  const scrollToEnd = () => {
    if (editorRef.current) {
      editorRef.current.scrollToEnd()
    }
  }

  const decorators = useMemo(() => {
    return [
      // we use this decorator to expand to if form is submitted
      // while it has error
      createFocusDecorator(() => {
        const expandTolFields = () => {
          setTopFieldsCollapsed(false)
        }

        return [
          {
            name: 'to',
            focus: expandTolFields
          }
        ]
      })
    ]
  }, [])

  return (
    <Form
      validate={validate}
      onSubmit={onSubmit}
      decorators={decorators}
      mutators={{ ...arrayMutators }}
      initialValues={initialValues}
      initialValuesEqual={isEqual}
      keepDirtyOnReinitialize
      render={formProps => {
        const values = formProps.values as EmailFormValues
        const fromField = values.from
        const uploadOrigin: UploadOrigin =
          fromField.type === GOOGLE_CREDENTIAL
            ? 'gmail'
            : fromField.type === MICROSOFT_CREDENTIAL
            ? 'outlook'
            : 'mailgun'

        return (
          <form
            className={classes.root}
            id="email-compose-form"
            onSubmit={formProps.handleSubmit}
          >
            <div className={classes.container}>
              <div className={classes.topFields}>
                {topFieldsCollapsed ? (
                  <div onClick={() => setTopFieldsCollapsed(false)}>
                    {props.renderCollapsedFields(values)}
                  </div>
                ) : (
                  props.renderFields(values)
                )}
              </div>
              <Field
                placeholder="Subject"
                name="subject"
                InputProps={{
                  onFocus: () => setTopFieldsCollapsed(true),
                  inputProps: {
                    autoFocus: hasRecipients && !hasSubject,
                    'data-test': 'email-subject'
                  }
                }}
                fullWidth
                color="secondary"
                component={TextField}
              />

              <EmailBody
                editorRef={editorRef}
                DraftEditorProps={{
                  onFocus: () => setTopFieldsCollapsed(true)
                }}
                autofocus={autofocusBody}
                hasSignatureByDefault={props.hasSignatureByDefault}
                hasStaticBody={!!marketingTemplate || props.hasStaticBody}
                hasTemplateVariables={props.hasTemplateVariables}
                content={
                  marketingTemplate
                    ? marketingTemplatePreviewHtml
                    : initialValues.body
                }
                attachments={
                  <Field name="attachments" component={AttachmentsList} />
                }
                uploadAttachment={uploadAttachment}
                uploadOrigin={uploadOrigin}
                editorState={editorState}
                onChangeEditor={setEditorState}
                stateFromHtmlOptions={bodyEditor.stateFromHtmlOptions}
              />
              {marketingTemplate && (
                <Callout dense>
                  <Box display="flex" alignItems="center">
                    <Box color={theme.palette.warning.contrastText} flex={1}>
                      You are using a Marketing Center Template
                    </Box>
                    <DangerButton
                      onClick={() => {
                        selectMarketingTemplate(null, values)
                      }}
                    >
                      Remove
                    </DangerButton>
                  </Box>
                </Callout>
              )}
            </div>

            {children}

            <Footer
              isSubmitDisabled={
                typeof isSubmitDisabled === 'function'
                  ? isSubmitDisabled(values)
                  : isSubmitDisabled
              }
              uploadAttachment={uploadAttachment}
              uploadOrigin={uploadOrigin}
              deal={props.deal}
              onCancel={onCancel}
              onDelete={onDelete}
              onChanged={scrollToEnd}
              hasStaticBody={props.hasStaticBody}
              className={classes.footer}
              updateBody={bodyEditor.update}
              disableMarketingTemplates={disableMarketingTemplates}
              setMarketingTemplate={template =>
                selectMarketingTemplate(template, values)
              }
              onClickAddDealAttachments={onClickAddDealAttachments}
            />
          </form>
        )
      }}
    />
  )
}
