import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab'

import { useStyles } from '../../styles'
import { EditorGroup } from '../EditorGroup'

const MAX_PARKING = 5
const numbersArray = [...Array(MAX_PARKING).keys()]

export const ParkingGroup = () => {
  const classes = useStyles()

  return (
    <EditorGroup title="Parking Spaces">
      <ToggleButtonGroup
        value={0}
        className={classes.ToggleButtonGroup}
        exclusive
        aria-label="parking"
      >
        <ToggleButton
          className={classes.ToggleButton}
          value={0}
          aria-label="any parking"
        >
          Any
        </ToggleButton>
        {numbersArray.map(i => (
          <ToggleButton
            className={classes.ToggleButton}
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
