import { MenuItem } from '@material-ui/core'

import { TaskTypeOptions } from './options'

interface Props {
  defaultValue: string
  closeHandler: () => void
}

export function InlineTypeCell({ defaultValue, closeHandler }: Props) {
  const handleSelectItem = (value: string) => {
    console.log(value)
    closeHandler()
  }

  return (
    <>
      {TaskTypeOptions.map(({ label, value }) => (
        <MenuItem
          key={value}
          selected={value === defaultValue}
          onClick={() => handleSelectItem(value)}
        >
          {label}
        </MenuItem>
      ))}
    </>
  )
}
