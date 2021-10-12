import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab'

import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'

import { useStyles } from '../../styles'
import { EditorGroup } from '../EditorGroup'

const MAX_PARKING = 5
const numbersArray = [...Array(MAX_PARKING).keys()]

export const ParkingGroup = ({
  filters,
  updateFilters
}: Omit<FilterButtonDropDownProp<AlertFilters>, 'resultsCount'>) => {
  const classes = useStyles()

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newValue: number | null
  ) => {
    updateFilters({
      minimum_parking_spaces: newValue ? Number(newValue) : null
    })
  }

  return (
    <EditorGroup title="Parking Spaces">
      <ToggleButtonGroup
        value={filters.minimum_parking_spaces || 0}
        onChange={handleChange}
        className={classes.ToggleButtonGroup}
        exclusive
        aria-label="parking"
      >
        <ToggleButton
          classes={{
            root: classes.ToggleButton,
            selected: classes.ToggleButtonSelected
          }}
          value={0}
          aria-label="any parking"
        >
          Any
        </ToggleButton>
        {numbersArray.map(i => (
          <ToggleButton
            classes={{
              root: classes.ToggleButton,
              selected: classes.ToggleButtonSelected
            }}
            key={i + 1}
            value={i + 1}
            aria-label={`${i + 1} parking(s)`}
          >
            {i + 1}+
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </EditorGroup>
  )
}
