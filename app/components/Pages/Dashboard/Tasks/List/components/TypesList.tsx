import { MenuItem } from '@material-ui/core'

export const TaskTypeOptions: {
  label: string
  value: CRMTaskTypes
}[] = [
  {
    label: 'Call',
    value: 'Call'
  },
  {
    label: 'In-Person Meeting',
    value: 'In-Person Meeting'
  },
  {
    label: 'Text',
    value: 'Text'
  },
  {
    label: 'Chat',
    value: 'Chat'
  },
  {
    label: 'Mail',
    value: 'Mail'
  },
  {
    label: 'Email',
    value: 'Email'
  },
  {
    label: 'Other',
    value: 'Other'
  }
]

interface Props {
  selectedItem: Nullable<CRMTaskTypes>
  onSelectItem: (value: CRMTaskTypes) => void
}

export function TypesList({ selectedItem, onSelectItem }: Props) {
  return (
    <>
      {TaskTypeOptions.map(({ label, value }) => (
        <MenuItem
          key={value}
          selected={value === selectedItem}
          onClick={() => onSelectItem(value)}
        >
          {label}
        </MenuItem>
      ))}
    </>
  )
}
