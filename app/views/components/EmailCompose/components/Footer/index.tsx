import React from 'react'
import { Field } from 'react-final-form'

import ActionButton from 'components/Button/ActionButton'

import DateTimePicker from 'components/DateTimePicker/next'
import { formatDate } from 'components/DateTimePicker/helpers'

import { FooterContainer } from './styled'
import { textForSubmitButton } from './helpers'
import SchedulerButton from './SchedulerButton'
import { EmailAttachmentsDropdown } from '../EmailAttachmentsDropdown'
import { EmailFormValues } from '../../types'

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
}

export function Footer(props: Props) {
  const due_at = props.formProps.values.due_at
  const isScheduled = !!due_at

  return (
    <FooterContainer>
      <div className="features-list">
        <EmailAttachmentsDropdown
          deal={props.deal}
          onChanged={props.onChanged}
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
            disabled={props.isSubmitting || props.isSubmitDisabled}
          >
            Cancel
          </ActionButton>
        )}
        <ActionButton
          data-test="compose-send-email"
          type="submit"
          disabled={props.isSubmitting || props.isSubmitDisabled}
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
      </div>
    </FooterContainer>
  )
}
