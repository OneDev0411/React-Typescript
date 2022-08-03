import { MenuItem, Box } from '@material-ui/core'

import { muiIconSizes } from '@app/views/components/SvgIcons'
import { eventTypesIcons } from '@app/views/utils/event-types-icons'

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
  selectedItem?: Nullable<CRMTaskTypes>
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
          <Box display="flex" alignItems="center">
            {eventTypesIcons[value].icon({
              size: muiIconSizes.small
            })}
            <Box ml={1}>{label}</Box>
          </Box>
        </MenuItem>
      ))}
    </>
  )
}
