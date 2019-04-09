import React from 'react'
import { Field } from 'react-final-form'

import ActionButton from 'components/Button/ActionButton'
import IconButton from 'components/Button/IconButton'
import TimeIcon from 'components/SvgIcons/Time/IconTime'
import Tooltip from 'components/tooltip'
import DateTimePicker from 'components/DateTimePicker/next'
import { formatDate } from 'components/DateTimePicker/helpers'

import { AddDealFile } from '../components/AddDealFile'
import { FooterContainer } from './styled'

function SchedulerButton(props) {
  return (
    <Tooltip caption="Schedule Email">
      <IconButton inverse appearance="primary" onClick={props.onOpen}>
        <TimeIcon />
      </IconButton>
    </Tooltip>
  )
}

function textForSubmitButton({ isSubmitting, isDateSet }) {
  if (isSubmitting) {
    return 'Sending...'
  }

  if (isDateSet) {
    return 'Save'
  }

  return 'Send'
}

export function Footer(props) {
  const due_at = props.formProps.values.due_at

  return (
    <FooterContainer>
      <div className="featuresList">
        {props.hasDealsAttachments && (
          <Field
            name="attachments"
            deal={props.deal}
            initialAttachments={props.initialAttachments}
            component={AddDealFile}
          />
        )}
      </div>

      <div className="actionBar">
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
              saveButtonText="Schedule"
              selectedDate={fieldProps.input.value}
              onDone={fieldProps.input.onChange}
              containerStyle={{
                top: '-8px',
                right: '0',
                left: 'unset',
                transform: 'translateY(-100%)'
              }}
            />
          )}
        />
      </div>
    </FooterContainer>
  )
}
