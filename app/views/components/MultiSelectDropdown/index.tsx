import { useState } from 'react'

import {
  Select,
  Input,
  Chip,
  MenuItem,
  Checkbox,
  ListItemText,
  makeStyles,
  Theme,
  MenuProps
} from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    select: {
      width: '100%'
    },
    menuList: {
      maxHeight: theme.spacing(30)
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap'
    },
    chip: {
      margin: 2
    }
  }),
  {
    name: 'MultiSelectDropDown'
  }
)

interface Item {
  label: string
  value: string
  readonly?: boolean
}

interface Props<T> {
  list: T[]
  defaultValues: T[]
  MenuProps?: Partial<MenuProps>
  onChange: (list: Item['value'][]) => void
}

export function MultiSelectDropDown<T extends Item>({
  list,
  defaultValues = [],
  MenuProps = {},
  onChange
}: Props<T>) {
  const classes = useStyles()
  const [selectedItems, setSelectedItems] = useState<T[]>(defaultValues)

  const handleChange = (item: T) => {
    const newList = selectedItems.some(({ value }) => item.value === value)
      ? selectedItems.filter(({ value }) => value === item.value)
      : [...selectedItems, item]

    setSelectedItems(newList)
    onChange(newList.map(item => item.value))
  }

  return (
    <Select
      multiple
      value={selectedItems}
      input={<Input multiline />}
      renderValue={(selected: T[]) => (
        <div className={classes.chips}>
          {selected.map(({ value, label }) => (
            <Chip
              key={value}
              size="small"
              label={label}
              className={classes.chip}
            />
          ))}
        </div>
      )}
      MenuProps={{
        // https://github.com/mui-org/material-ui/issues/19245
        variant: 'menu',
        classes: {
          list: classes.menuList
        },
        ...MenuProps
      }}
      className={classes.select}
    >
      {list.map(item => (
        <MenuItem
          key={item.value}
          value={item.value}
          disabled={item.readonly ?? false}
          onClick={() => handleChange(item)}
        >
          <Checkbox
            checked={selectedItems.some(({ value }) => item.value === value)}
          />
          <ListItemText primary={item.label} />
        </MenuItem>
      ))}
    </Select>
  )
}
