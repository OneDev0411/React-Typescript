import { RadioGroup, RadioGroupProps, RadioItem } from 'components/RadioGroup'

export type YesNoAnswer = 'Yes' | 'No'

export interface ShowingYesNoRadioGroupProps
  extends Omit<RadioGroupProps<YesNoAnswer>, 'options'> {
  yesLabel?: string
  noLabel?: string
}

function ShowingYesNoRadioGroup({
  yesLabel = 'Yes',
  noLabel = 'No',
  ...otherProps
}: ShowingYesNoRadioGroupProps) {
  const yesNoOptions: RadioItem<YesNoAnswer>[] = [
    {
      label: yesLabel,
      value: 'Yes'
    },
    {
      label: noLabel,
      value: 'No'
    }
  ]

  return <RadioGroup {...otherProps} options={yesNoOptions} />
}

export default ShowingYesNoRadioGroup
