import React from 'react'
import { Field } from 'react-final-form'

import ActionButton from 'components/Button/ActionButton'

import DateTimePicker from 'components/DateTimePicker/next'
import { formatDate } from 'components/DateTimePicker/helpers'

import { AddDealFile } from '../components/AddDealFile'
import { FooterContainer } from './styled'
import { textForSubmitButton } from './helpers'
import SchedulerButton from './SchedulerButton'
import { EmailAttachmentsDropdown } from '../components/EmailAttachmentsDropdown'

export function Footer(props) {
  const due_at = props.formProps.values.due_at
  const isScheduled = !!due_at

  return (
    <FooterContainer>
      <div className="features-list">
        <EmailAttachmentsDropdown />
        {props.hasDealsAttachments && (
          <Field
            name="attachments"
            deal={props.deal}
            initialAttachments={props.initialAttachments}
            component={AddDealFile}
          />
        )}
      </div>

      <div className="action-bar">
        {isScheduled && (
          <span className="scheduled-on">Send on {formatDate(due_at)}</span>
        )}

        <ActionButton
          data-test="compose-send-email"
          type="submit"
          disabled={props.submitting || props.isSubmitDisabled}
          onClick={props.handleSubmit}
          leftRounded
        >
          {textForSubmitButton({
            isSubmitting: props.submitting,
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
      </div>
    </FooterContainer>
  )
}
