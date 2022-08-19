import { Chip, Typography } from '@material-ui/core'
import cn from 'classnames'
import Downshift from 'downshift'

import { getCurrentValues } from './helper'
import { useStyles } from './styles'

interface Props {
  id: string
  filterConfig: IFilterConfig
  isActive: boolean
  isIncomplete: boolean
  values: ILabelValue[]
  operator: IFilterOperator
  onFilterChange: (values: ILabelValue[], operator: IFilterOperator) => void
  onRemove: () => void
  onToggleFilterActive: () => void
}

export const FilterItem = (props: Props) => {
  const classes = useStyles()

  console.log({ props })

  const {
    filterConfig,
    isActive,
    isIncomplete,
    values,
    operator,
    onToggleFilterActive,
    onRemove,
    onFilterChange
  } = props

  return (
    <div className={classes.container}>
      <Chip
        variant="outlined"
        size="small"
        label={
          <div className={classes.filterChip}>
            <Typography variant="subtitle2" className={classes.filterLabel}>
              {filterConfig.label}
            </Typography>
            {operator?.name}&nbsp;
            {getCurrentValues(isActive, values)}
          </div>
        }
        className={cn({ [classes.incomplete]: isIncomplete && !isActive })}
        onDelete={onRemove}
        onClick={onToggleFilterActive}
      />
      <Downshift isOpen={isActive} onOuterClick={onToggleFilterActive}>
        {({ isOpen }) =>
          isOpen && (
            <div className={classes.content}>
              {filterConfig.renderer({
                onFilterChange,
                onToggleFilterActive,
                values,
                operator
              })}
            </div>
          )
        }
      </Downshift>
    </div>
  )
}
