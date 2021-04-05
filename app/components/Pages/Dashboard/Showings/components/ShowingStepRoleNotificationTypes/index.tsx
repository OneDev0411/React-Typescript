import React, { useState } from 'react'

import { Box, Button } from '@material-ui/core'

import {
  QuestionForm,
  QuestionSection,
  QuestionTitle,
  useWizardContext
} from 'components/QuestionWizard'

import { RadioGroup, RadioGroupProps } from 'components/RadioGroup'

import ShowingStepRoleNotificationTypesMediums from './ShowingStepRoleNotificationTypesMediums'

type NotificationTypeValue = [boolean, INotificationDeliveryType[]]
type NotificationTypeOption = 'No' | 'NoWithTypes' | 'Yes'

interface ShowingStepRoleNotificationTypesProps {
  question: string
  value: NotificationTypeValue
  onChange: (value: NotificationTypeValue) => void
  hasNoAnywaysOption?: boolean
  yesOptionLabel: string
}

function ShowingStepRoleNotificationTypes({
  question,
  hasNoAnywaysOption = false,
  value,
  onChange,
  yesOptionLabel
}: ShowingStepRoleNotificationTypesProps) {
  const wizard = useWizardContext()
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
    wizard.next()
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
        <ShowingStepRoleNotificationTypesMediums
          types={types}
          onTypesChange={handleChangeTypes}
        />
      )
    },
    {
      label: yesOptionLabel,
      value: 'Yes',
      children: (!radioValue || radioValue === 'Yes') && (
        <ShowingStepRoleNotificationTypesMediums
          types={types}
          onTypesChange={handleChangeTypes}
        />
      )
    }
  ]

  return (
    <QuestionSection>
      <QuestionTitle>{question}</QuestionTitle>
      <QuestionForm>
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
      </QuestionForm>
    </QuestionSection>
  )
}

export default ShowingStepRoleNotificationTypes
