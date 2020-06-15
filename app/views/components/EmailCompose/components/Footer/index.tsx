import React, { useState } from 'react'
import { Field, useFormState, useField } from 'react-final-form'

import { IconButton } from '@material-ui/core'

import ActionButton from 'components/Button/ActionButton'

import DateTimePicker from 'components/DateTimePicker/next'
import { formatDate } from 'components/DateTimePicker/helpers'

import { uploadEmailAttachment } from 'models/email/upload-email-attachment'

import IconDelete from 'components/SvgIcons/Delete/IconDelete'

import { isFileAttachment } from '../../helpers/is-file-attachment'
import { FooterContainer, FooterInnerContainer } from './styled'
import { textForSubmitButton } from './helpers'
import SchedulerButton from './SchedulerButton'
import { EmailAttachmentsDropdown } from '../EmailAttachmentsDropdown'
import { useButtonStyles } from '../../../../../styles/use-button-styles'
import IconTemplate from '../../../SvgIcons/Template/IconTemplate'
import { iconSizes } from '../../../SvgIcons/icon-sizes'
import { DropdownToggleButton } from '../../../DropdownToggleButton'
import { useIconStyles } from '../../../../../styles/use-icon-styles'
import { FooterBottomDrawer } from './FooterBottomDrawer'
import { TemplateSelector } from './TemplateSelector'

interface Props {
  isSubmitDisabled: boolean
  deal?: IDeal
  onChanged: () => void
  hasStaticBody?: boolean
  updateBody: (body: string) => void
  setMarketingTemplate: (template: IBrandEmailTemplate | null) => void
  onCancel?: () => void
  onDelete?: (values) => void | Promise<any>
  className?: string
  uploadAttachment: typeof uploadEmailAttachment
}

export function Footer({
  onDelete,
  updateBody,
  setMarketingTemplate,
  hasStaticBody,
  ...props
}: Props) {
  const formState = useFormState()
  const dueAtField = useField('due_at')
  const subjectField = useField('subject')

  const dueAt = dueAtField.input.value
  const isScheduled = !!dueAt

  const buttonClasses = useButtonStyles()
  const iconClasses = useIconStyles()

  const [isDeleting, setDeleting] = useState(false)
  const [isTemplateDrawerOpen, setTemplateDrawerOpen] = useState(false)

  const busy = isDeleting || formState.submitting

  const initialAttachments: IFile[] = (
    formState.initialValues.attachments || []
  ).filter(isFileAttachment)

  const selectEmailTemplate = (template: IBrandEmailTemplate) => {
    setTemplateDrawerOpen(false)
    setMarketingTemplate(null)
    subjectField.input.onChange(template.subject)
    updateBody(template.body)
  }
  const selectMarketingTemplate = (template: IMarketingTemplateInstance) => {
    setTemplateDrawerOpen(false)
    setMarketingTemplate(template)
  }

  return (
    <FooterContainer>
      <FooterBottomDrawer isOpen={isTemplateDrawerOpen}>
        <TemplateSelector
          onEmailTemplateSelected={selectEmailTemplate}
          onMarketingTemplateSelected={selectMarketingTemplate}
        />
      </FooterBottomDrawer>
      <FooterInnerContainer className={props.className}>
        <div className="features-list">
          <EmailAttachmentsDropdown
            deal={props.deal}
            onChanged={props.onChanged}
            uploadAttachment={props.uploadAttachment}
            initialAttachments={initialAttachments}
          />
          {!hasStaticBody && (
            <DropdownToggleButton
              isActive={isTemplateDrawerOpen}
              onClick={() => setTemplateDrawerOpen(open => !open)}
            >
              <IconTemplate
                className={iconClasses.rightMargin}
                size={iconSizes.small}
              />{' '}
              Templates
            </DropdownToggleButton>
          )}
        </div>

        <div className="action-bar">
          {isScheduled && (
            <span className="scheduled-on">Send on {formatDate(dueAt)}</span>
          )}
          {props.onCancel && (
            <ActionButton
              appearance="flat"
              onClick={props.onCancel}
              disabled={busy}
            >
              Cancel
            </ActionButton>
          )}
          <ActionButton
            appearance="secondary"
            data-test="compose-send-email"
            type="submit"
            disabled={busy || props.isSubmitDisabled}
            leftRounded
          >
            {textForSubmitButton({
              isSubmitting: formState.submitting,
              isDateSet: isScheduled
            })}
          </ActionButton>
          <Field
            name="due_at"
            render={fieldProps => (
              <DateTimePicker
                popUpButton={buttonProps => (
                  <SchedulerButton
                    onOpen={buttonProps.toggleOpen}
                    isScheduled={isScheduled}
                  />
                )}
                disabledDays={{
                  before: new Date()
                }}
                popUpPosition="top-right"
                saveButtonText="Schedule"
                initialSelectedDate={fieldProps.input.value}
                onDone={fieldProps.input.onChange}
              />
            )}
          />

          {onDelete && (
            <IconButton
              onClick={async () => {
                setDeleting(true)

                try {
                  await onDelete(formState.values)
                } finally {
                  setDeleting(false)
                }
              }}
              disabled={busy}
              className={buttonClasses.danger}
            >
              <IconDelete />
            </IconButton>
          )}
        </div>
      </FooterInnerContainer>
    </FooterContainer>
  )
}
