import { Grid, Typography, TextField } from '@material-ui/core'

import { useStyles } from '../../styles'
import { EditorGroup } from '../EditorGroup'

export const SquareFootageGroup = () => {
  const classes = useStyles()

  return (
    <EditorGroup title="Square Footage">
      <Grid container alignItems="center" wrap="nowrap">
        <Grid item>
          <TextField
            size="small"
            type="number"
            placeholder="No Min"
            label="Min"
            variant="outlined"
          />
        </Grid>
        <Grid item>
          <Typography className={classes.to} variant="body1">
            To
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            size="small"
            type="number"
            placeholder="No Max"
            label="Max"
            variant="outlined"
          />
        </Grid>
      </Grid>
    </EditorGroup>
  )
}
