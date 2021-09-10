import { Button, Grid, Typography } from '@material-ui/core'
import BathtubOutlinedIcon from '@material-ui/icons/BathtubOutlined'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'

import { FilterEditor } from '../filterEditor'
import { useStyles } from '../styles'

const MAX_BATH = 5
const numbersArray = [...Array(MAX_BATH).keys()]

export const BathsEditor = () => {
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
            startIcon={<BathtubOutlinedIcon fontSize="small" />}
          >
            Baths
          </Button>
        )}
      >
        {() => (
          <Grid className={classes.editorRoot}>
            <Grid container alignItems="center" className={classes.header}>
              <BathtubOutlinedIcon />
              <Typography variant="subtitle1" className={classes.title}>
                Baths
              </Typography>
            </Grid>
            <ToggleButtonGroup
              value={0}
              className={classes.ToggleButtonGroup}
              exclusive
              aria-label="bathroom"
            >
              <ToggleButton
                className={classes.FullToggleButton}
                value={0}
                aria-label="any bathrooms"
              >
                Any
              </ToggleButton>
              {numbersArray.map(i => (
                <ToggleButton
                  className={classes.FullToggleButton}
                  key={i + 1}
                  value={i + 1}
                  aria-label={`${i + 1} bathroom(s)`}
                >
                  {i + 1}+
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Grid>
        )}
      </FilterEditor>
    </>
  )
}
