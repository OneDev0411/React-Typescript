import { useState } from 'react'

import { RadioGroup, RadioGroupProps } from 'components/RadioGroup'

import AdvanceNoticeRadioGroupLeadTimeOptions, {
  hourOptions
} from './AdvanceNoticeRadioGroupLeadTimeOptions'

type AdvanceNoticeValue = 'NoNeed' | 'NoSameDay' | 'LeadTime'

export interface AdvanceNoticeRadioGroupProps {
  noticePeriod: Nullable<number>
  onNoticePeriodChange?: (noticePeriod: Nullable<number>) => void
  sameDayAllowed: boolean
  onSameDayAllowedChange?: (sameDayAllowed: boolean) => void
  selectFirstLeadTimeOption?: boolean
  onSelect?: () => void
  onChange?: (sameDayAllowed: boolean, noticePeriod: Nullable<number>) => void
}

function AdvanceNoticeRadioGroup({
  noticePeriod,
  sameDayAllowed,
  onNoticePeriodChange,
  onSameDayAllowedChange,
  selectFirstLeadTimeOption = true,
  onSelect,
  onChange
}: AdvanceNoticeRadioGroupProps) {
  const [radioValue, setRadioValue] = useState<Nullable<AdvanceNoticeValue>>(
    () => {
      if (sameDayAllowed && noticePeriod === 0) {
        return 'NoNeed'
      }

      if (!sameDayAllowed && noticePeriod === null) {
        return 'NoSameDay'
      }

      if (sameDayAllowed && noticePeriod) {
        return 'LeadTime'
      }

      return null
    }
  )

  const getNextNoticePeriod = (value: AdvanceNoticeValue) => {
    if (value !== 'LeadTime') {
      return value === 'NoNeed' ? 0 : null
    }

    // Try to have a period notice when the selected option is lead time and
    // this step is passed
    if (value === 'LeadTime' && selectFirstLeadTimeOption) {
      return hourOptions[0].value
    }

    return noticePeriod
  }

  const handleChange = (value: AdvanceNoticeValue) => {
    const nextSameDayAllowed = value !== 'NoSameDay'
    const nextNoticePeriod = getNextNoticePeriod(value)

    if (sameDayAllowed !== nextSameDayAllowed) {
      onSameDayAllowedChange?.(nextSameDayAllowed)
    }

    if (noticePeriod !== nextNoticePeriod) {
      onNoticePeriodChange?.(nextNoticePeriod)
    }

    if (
      sameDayAllowed !== nextSameDayAllowed ||
      noticePeriod !== nextNoticePeriod
    ) {
      onChange?.(nextSameDayAllowed, nextNoticePeriod)
    }

    setRadioValue(value)

    if (value !== 'LeadTime') {
      onSelect?.()
    }
  }

  const handleLeadTimeChange = (nextNoticePeriod: number) => {
    if (!noticePeriod) {
      onSameDayAllowedChange?.(true)
    }

    if (noticePeriod !== nextNoticePeriod) {
      onNoticePeriodChange?.(nextNoticePeriod)
    }

    if (!sameDayAllowed || noticePeriod !== nextNoticePeriod) {
      onChange?.(true, nextNoticePeriod)
    }

    onSelect?.()
  }

  const options: RadioGroupProps<AdvanceNoticeValue>['options'] = [
    {
      label: 'No need for advance notice',
      value: 'NoNeed'
    },
    {
      label: 'No same day appointments',
      value: 'NoSameDay'
    },
    {
      label: 'Lead Time:',
      value: 'LeadTime',
      children: (!radioValue || radioValue === 'LeadTime') && (
        <AdvanceNoticeRadioGroupLeadTimeOptions
          value={noticePeriod}
          onChange={handleLeadTimeChange}
        />
      )
    }
  ]

  return (
    <RadioGroup<AdvanceNoticeValue>
      name="advanceNotice"
      options={options}
      value={radioValue}
      onChange={handleChange}
    />
  )
}

export default AdvanceNoticeRadioGroup
