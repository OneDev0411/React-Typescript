import { Button, Grid, Typography } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import TuneIcon from '@material-ui/icons/Tune'

import { FilterEditor } from '../filterEditor'
import { useStyles } from '../styles'

import { LotSizeGroup } from './lotSizeGroup'
import { MlsAreaGroup } from './MlsAreaGroup'
import { OpenHouseGroup } from './openHouseGroup'
import { ParkingGroup } from './parkingGroup'
import { PoolGroup } from './poolGroup'
import { SquareFootageGroup } from './squareFootageGroup'
import { StatusGroup } from './statusGroup'
import { SubdivisionGroup } from './subdivisionGroup'
import { YearBuiltGroup } from './yearBuiltGroup'

export const OtherEditor = () => {
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
            startIcon={<TuneIcon fontSize="small" />}
            endIcon={<AddIcon fontSize="small" />}
          >
            More Filters
          </Button>
        )}
      >
        {() => (
          <Grid className={classes.editorRoot}>
            <Grid container alignItems="center" className={classes.header}>
              <TuneIcon />
              <Typography variant="subtitle1" className={classes.title}>
                More Filters
              </Typography>
            </Grid>
            <Grid container direction="column">
              <StatusGroup />
              <OpenHouseGroup />
              <MlsAreaGroup />
              <ParkingGroup />
              <SubdivisionGroup />
              <SquareFootageGroup />
              <LotSizeGroup />
              <YearBuiltGroup />
              <PoolGroup />
            </Grid>
          </Grid>
        )}
      </FilterEditor>
    </>
  )
}
