import { RadioGroup, RadioItem, RadioGroupProps } from 'components/RadioGroup'

const approvalTypeOptions: RadioItem<IShowingApprovalType>[] = [
  {
    label: 'Appointments required, confirm with any',
    value: 'Any'
  },
  {
    label: 'Appointments required, confirm with all',
    value: 'All'
  },
  {
    label: 'Go and Show',
    value: 'None'
  }
  // {
  //   label: 'View Instructions only',
  //   value: 'None'
  // }
]

type ShowingApprovalTypeRadioGroupProps = Omit<
  RadioGroupProps<IShowingApprovalType>,
  'options'
>

function ShowingApprovalTypeRadioGroup(
  props: ShowingApprovalTypeRadioGroupProps
) {
  return (
    <RadioGroup {...props} name="approvalType" options={approvalTypeOptions} />
  )
}

export default ShowingApprovalTypeRadioGroup
