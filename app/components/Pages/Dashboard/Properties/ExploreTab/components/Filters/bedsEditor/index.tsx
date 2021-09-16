import { Button, Grid, TextField, Typography } from '@material-ui/core'
import KingBedOutlinedIcon from '@material-ui/icons/KingBedOutlined'
import { Autocomplete } from '@material-ui/lab'

import { FilterEditor } from '../filterEditor'
import { useStyles } from '../styles'

import { createBedArray } from './helpers'

export const BedsEditor = () => {
  const classes = useStyles()

  return (
    <>
      <FilterEditor
        resultCount={315}
        renderButton={props => (
          <Button
            className={classes.button}
            onClick={props.onOpen}
            variant="outlined"
            size="medium"
            startIcon={<KingBedOutlinedIcon fontSize="small" />}
          >
            Beds
          </Button>
        )}
      >
        {() => (
          <Grid className={classes.editorRoot}>
            <Grid container alignItems="center" className={classes.header}>
              <KingBedOutlinedIcon />
              <Typography variant="subtitle1" className={classes.title}>
                Beds
              </Typography>
            </Grid>
            <Grid container alignItems="center" wrap="nowrap">
              <Grid item xs={5}>
                <Autocomplete
                  size="small"
                  options={createBedArray()}
                  getOptionLabel={option =>
                    option ? option.toString() : 'No Min'
                  }
                  renderInput={params => (
                    <TextField {...params} label="Min" variant="outlined" />
                  )}
                />
              </Grid>
              <Grid item container justifyContent="center" xs={2}>
                <Typography className={classes.to} variant="body1">
                  To
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <Autocomplete
                  size="small"
                  options={createBedArray()}
                  getOptionLabel={option =>
                    option ? option.toString() : 'No Max'
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder="No Max"
                      label="Max"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
        )}
      </FilterEditor>
    </>
  )
}
