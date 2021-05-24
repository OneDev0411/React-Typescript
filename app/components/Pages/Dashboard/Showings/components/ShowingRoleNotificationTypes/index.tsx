import { useState, ReactNode } from 'react'

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
import useIsQuestionWizardCurrentStep from '../../hooks/use-is-question-wizard-current-step'

type NotificationTypeOption = 'No' | 'NoWithTypes' | 'Yes'

export interface ShowingRoleNotificationTypesProps
  extends Pick<QuestionSectionProps, 'error'> {
  question: ReactNode

  canApprove?: boolean
  onCanApproveChange?: (canApprove: boolean) => void

  notificationTypes: INotificationDeliveryType[]
  onNotificationTypesChange: (
    notificationTypes: INotificationDeliveryType[]
  ) => void

  hasNoAnywaysOption?: boolean
  yesOptionLabel: string
}

function ShowingRoleNotificationTypes({
  question,
  hasNoAnywaysOption = false,
  onCanApproveChange,
  notificationTypes,
  onNotificationTypesChange,

  yesOptionLabel,
  error
}: ShowingRoleNotificationTypesProps) {
  const nextStep = useQuestionWizardSmartNext()
  // const [answer, types] = value
  const [radioValue, setRadioValue] = useState<
    Nullable<NotificationTypeOption>
  >(null)
  const isCurrentStep = useIsQuestionWizardCurrentStep()

  const handleChangeTypes = (types: INotificationDeliveryType[]) => {
    // onChange([answer, types])
    onNotificationTypesChange(types)
  }

  const handleChange = (value: NotificationTypeOption) => {
    setRadioValue(value)

    const hasTypes = value !== 'No'

    onCanApproveChange?.(hasTypes)
    onNotificationTypesChange(hasTypes ? ['sms', 'email'] : [])
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
          types={notificationTypes}
          onTypesChange={handleChangeTypes}
        />
      )
    },
    {
      label: yesOptionLabel,
      value: 'Yes',
      children: (!radioValue || radioValue === 'Yes') && (
        <ShowingRoleNotificationTypesMediums
          types={notificationTypes}
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
        {isCurrentStep && (
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleContinue}
              disabled={
                !radioValue ||
                (radioValue !== 'No' && !notificationTypes.length)
              }
            >
              Continue
            </Button>
          </Box>
        )}
      </SmartQuestionForm>
    </QuestionSection>
  )
}

export default ShowingRoleNotificationTypes
