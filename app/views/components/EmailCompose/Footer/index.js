import React from 'react'
import { Field } from 'react-final-form'

import ActionButton from 'components/Button/ActionButton'

import DateTimePicker from 'components/DateTimePicker/next'
import { formatDate } from 'components/DateTimePicker/helpers'

import { AddDealFile } from '../components/AddDealFile'
import { FooterContainer } from './styled'
import { textForSubmitButton } from './helpers'
import SchedulerButton from './SchedulerButton'

export function Footer(props) {
  const due_at = props.formProps.values.due_at

  return (
    <FooterContainer>
      <div className="features-list">
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
        {due_at && (
          <span className="scheduled-on">Send on {formatDate(due_at)}</span>
        )}

        <ActionButton
          type="submit"
          disabled={props.isSubmitting}
          onClick={props.handleSubmit}
        >
          {textForSubmitButton({
            isSubmitting: props.isSubmitting,
            isDateSet: !!due_at
          })}
        </ActionButton>
        <Field
          name="due_at"
          render={fieldProps => (
            <DateTimePicker
              popUpButton={buttonProps => (
                <SchedulerButton onOpen={buttonProps.toggleOpen} />
              )}
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
