import React, { useState, ReactNode } from 'react'

import { Box, Button } from '@material-ui/core'

import {
  QuestionSection,
  QuestionTitle,
  QuestionSectionProps
} from 'components/QuestionWizard'

import { RadioGroup, RadioGroupProps } from 'components/RadioGroup'

import ShowingRoleNotificationTypesMediums from './ShowingRoleNotificationTypesMediums'
import useQuestionWizardSmartNext from '../../hooks/use-question-wizard-smart-next'
import SmartQuestionForm from '../SmartQuestionForm'

export type NotificationTypeValue = [boolean, INotificationDeliveryType[]]

type NotificationTypeOption = 'No' | 'NoWithTypes' | 'Yes'

export interface ShowingRoleNotificationTypesProps
  extends Pick<QuestionSectionProps, 'error'> {
  question: ReactNode
  value: NotificationTypeValue
  onChange: (value: NotificationTypeValue) => void
  hasNoAnywaysOption?: boolean
  yesOptionLabel: string
}

function ShowingRoleNotificationTypes({
  question,
  hasNoAnywaysOption = false,
  value,
  onChange,
  yesOptionLabel,
  error
}: ShowingRoleNotificationTypesProps) {
  const nextStep = useQuestionWizardSmartNext()
  const [answer, types] = value
  const [radioValue, setRadioValue] = useState<
    Nullable<NotificationTypeOption>
  >(null)

  const handleChangeTypes = (types: INotificationDeliveryType[]) => {
    onChange([answer, types])
  }

  const handleChange = (value: NotificationTypeOption) => {
    setRadioValue(value)

    const hasTypes = value !== 'No'

    onChange([hasTypes, hasTypes ? ['sms', 'email'] : []])
  }

  const handleContinue = () => {
    nextStep()
  }

  const options: RadioGroupProps<NotificationTypeOption>['options'] = [
    {
      label: 'No.',
      value: 'No'
    },
    hasNoAnywaysOption && {
      label: 'No, but send him a notification anyways.',
      value: 'NoWithTypes',
      children: radioValue === 'NoWithTypes' && (
        <ShowingRoleNotificationTypesMediums
          types={types}
          onTypesChange={handleChangeTypes}
        />
      )
    },
    {
      label: yesOptionLabel,
      value: 'Yes',
      children: (!radioValue || radioValue === 'Yes') && (
        <ShowingRoleNotificationTypesMediums
          types={types}
          onTypesChange={handleChangeTypes}
        />
      )
    }
  ]

  return (
    <QuestionSection error={error}>
      <QuestionTitle>{question}</QuestionTitle>
      <SmartQuestionForm>
        <RadioGroup<NotificationTypeOption>
          name="notificationTypes"
          options={options}
          onChange={handleChange}
          value={radioValue}
        />
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleContinue}
            disabled={!radioValue || (radioValue !== 'No' && !types.length)}
          >
            Continue
          </Button>
        </Box>
      </SmartQuestionForm>
    </QuestionSection>
  )
}

export default ShowingRoleNotificationTypes
