import React, { useState } from 'react'
import { Field } from 'react-final-form'

import { IconButton } from '@material-ui/core'

import ActionButton from 'components/Button/ActionButton'

import DateTimePicker from 'components/DateTimePicker/next'
import { formatDate } from 'components/DateTimePicker/helpers'

import { uploadEmailAttachment } from 'models/email/upload-email-attachment'

import IconDelete from 'components/SvgIcons/Delete/IconDelete'

import { FooterContainer } from './styled'
import { textForSubmitButton } from './helpers'
import SchedulerButton from './SchedulerButton'
import { EmailAttachmentsDropdown } from '../EmailAttachmentsDropdown'
import { EmailFormValues } from '../../types'
import { useButtonStyles } from '../../../../../styles/use-button-styles'

interface Props {
  isSubmitDisabled: boolean
  formProps: {
    values: EmailFormValues
  }
  deal?: IDeal
  onChanged: () => void
  initialAttachments: IFile[]
  isSubmitting: boolean
  enableSchedule: boolean
  onCancel?: () => void
  onDelete?: (values: EmailFormValues) => void | Promise<any>
  className?: string
  uploadAttachment: typeof uploadEmailAttachment
}

export function Footer({ onDelete, ...props }: Props) {
  const due_at = props.formProps.values.due_at
  const isScheduled = !!due_at

  const buttonClasses = useButtonStyles()

  const [isDeleting, setDeleting] = useState(false)

  const busy = isDeleting || props.isSubmitting

  return (
    <FooterContainer className={props.className}>
      <div className="features-list">
        <EmailAttachmentsDropdown
          deal={props.deal}
          onChanged={props.onChanged}
          uploadAttachment={props.uploadAttachment}
          initialAttachments={props.initialAttachments}
        />
      </div>

      <div className="action-bar">
        {isScheduled && (
          <span className="scheduled-on">Send on {formatDate(due_at)}</span>
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
          data-test="compose-send-email"
          type="submit"
          disabled={busy || props.isSubmitDisabled}
          leftRounded={props.enableSchedule}
        >
          {textForSubmitButton({
            isSubmitting: props.isSubmitting,
            isDateSet: isScheduled
          })}
        </ActionButton>
        {props.enableSchedule ? (
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
        ) : null}

        {onDelete && (
          <IconButton
            onClick={async () => {
              setDeleting(true)

              try {
                await onDelete(props.formProps.values)
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
    </FooterContainer>
  )
}
