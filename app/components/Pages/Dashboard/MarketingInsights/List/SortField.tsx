import { MenuItem } from '@material-ui/core'

import { BaseDropdown } from 'components/BaseDropdown'

import { useInsightsContext } from '../context/use-insights-context'
import { SortableColumnsType } from '../types'

interface Props {
  label: string
  onChange: (item: SortableColumnsType) => void
}

export const SortFields = ({ label, onChange }: Props) => {
  const { sortOptions } = useInsightsContext()

  return (
    <BaseDropdown
      component="div"
      buttonLabel={label || 'A - Z'}
      renderMenu={({ close }) => (
        <div>
          {sortOptions.map((column, index) => (
            <MenuItem
              key={index}
              value={index}
              onClick={() => {
                close()
                onChange(column)
              }}
            >
              {column.label}
            </MenuItem>
          ))}
        </div>
      )}
    />
  )
}
