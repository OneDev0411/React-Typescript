import { RadioGroup, RadioItem, RadioGroupProps } from 'components/RadioGroup'

const approvalTypeOptions: RadioItem<IShowingApprovalType>[] = [
  {
    label: 'Appointments required, confirm with any',
    value: 'Any',
    description:
      'Permission must be obtained from ANY of the designated listing contacts (Owner(s)/Occupant(s)/ Listing Agent(s)) before the appointment request can be confirmed. Typically used for occupied homes.'
  },
  {
    label: 'Appointments required, confirm with all',
    value: 'All',
    description:
      'Permission must be obtained from ALL designated listing contacts (Owner(s)/Occupant(s)/Listing Agent(s)) before the appointment request can be confirmed.'
  },
  {
    label: 'Go and Show',
    value: 'None',
    description:
      'Appointment requests are documented and immediately confirmed. No additional calls will be made. Typically used for vacant homes on lockbox.'
  }
]

export type ShowingApprovalTypeRadioGroupProps = Omit<
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
