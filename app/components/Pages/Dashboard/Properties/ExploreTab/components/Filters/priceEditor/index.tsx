import { Button, Grid, TextField, Typography } from '@material-ui/core'
import AttachMoneyOutlinedIcon from '@material-ui/icons/AttachMoneyOutlined'

import { FilterEditor } from '../filterEditor'
import { useStyles } from '../styles'

export const PriceEditor = () => {
  const classes = useStyles()

  return (
    <>
      <FilterEditor
        resultCount={315}
        renderButton={props => (
          <Button
            variant="outlined"
            size="medium"
            className={classes.button}
            onClick={props.onOpen}
            startIcon={<AttachMoneyOutlinedIcon fontSize="small" />}
          >
            Any Price
          </Button>
        )}
      >
        {() => (
          <Grid className={classes.editorRoot}>
            <Grid container alignItems="center" className={classes.header}>
              <AttachMoneyOutlinedIcon />
              <Typography variant="subtitle1" className={classes.title}>
                Price
              </Typography>
            </Grid>

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
                <Typography style={{ padding: 8 }} variant="body1">
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
          </Grid>
        )}
      </FilterEditor>
    </>
  )
}
