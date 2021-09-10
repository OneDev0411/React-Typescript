import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab'

import { useStyles } from '../../styles'
import { EditorGroup } from '../EditorGroup'

export const PoolGroup = () => {
  const classes = useStyles()

  return (
    <EditorGroup title="Pool">
      <ToggleButtonGroup
        value={0}
        className={classes.ToggleButtonGroup}
        exclusive
        aria-label="pool"
      >
        <ToggleButton
          className={classes.ToggleButton}
          value="yes"
          aria-label="has pool"
        >
          Yes
        </ToggleButton>
        <ToggleButton
          className={classes.ToggleButton}
          value="no"
          aria-label="no pool"
        >
          No
        </ToggleButton>
        <ToggleButton
          className={classes.ToggleButton}
          value={0}
          aria-label="either"
        >
          Either
        </ToggleButton>
      </ToggleButtonGroup>
    </EditorGroup>
  )
}
