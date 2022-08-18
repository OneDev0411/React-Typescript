import { Chip } from '@material-ui/core'
import Downshift from 'downshift'

import { getCurrentValues } from './helper'
import { ItemTitle } from './styled'
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
    // isIncomplete,
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
        label={
          <ItemTitle>
            <span style={{ fontWeight: 600 }}>{filterConfig.label} </span>
            {operator && operator.name}&nbsp;
            {getCurrentValues(isActive, values)}
          </ItemTitle>
        }
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

  // return (
  //   <Container isActive={isActive} isIncomplete={isIncomplete}>
  //     <Downshift isOpen={isActive} onOuterClick={onToggleFilterActive}>
  //       {({ isOpen }) => (
  //         <div>
  //           {isOpen && (
  //             <Menu depth={3}>
  //               <Content>
  //                 {filterConfig.renderer({
  //                   onFilterChange,
  //                   onToggleFilterActive,
  //                   values,
  //                   operator
  //                 })}
  //               </Content>
  //             </Menu>
  //           )}
  //         </div>
  //       )}
  //     </Downshift>
  //   </Container>
  // )
}
