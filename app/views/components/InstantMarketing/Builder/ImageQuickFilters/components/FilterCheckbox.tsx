import { ChangeEvent, useState } from 'react'

import { Box, Checkbox, Typography } from '@material-ui/core'
import { Filters } from 'pikaso'

import { useContext } from '../use-context'

interface Props {
  title: string
  filter: Filters
  onChange: () => void
}

export function FilterCheckbox({ title, filter, onChange }: Props) {
  const { editor } = useContext()
  const [isChecked, setIsChecked] = useState(false)

  const handleChange = (checked: boolean) => {
    if (!checked) {
      editor?.board.background.image.removeFilter(filter)
    } else {
      editor?.board.background.image.addFilter(filter)
    }

    onChange()
    setIsChecked(checked)
  }

  return (
    <Box display="flex" alignItems="center">
      <Checkbox
        size="small"
        checked={isChecked}
        onChange={(_: ChangeEvent<HTMLInputElement>, checked: boolean) =>
          handleChange(checked)
        }
        color="secondary"
      />

      <Typography variant="caption">{title}</Typography>
    </Box>
  )
}
