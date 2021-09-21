import { Grid, Typography } from '@material-ui/core'
import TuneIcon from '@material-ui/icons/Tune'

import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'

import { FilterEditorFooter } from '../filterEditorFooter'
import { useStyles } from '../styles'

import { HomeStyleGroup } from './homeStyleGroup'
import { LotSizeGroup } from './lotSizeGroup'
import { MlsAreaGroup } from './MlsAreaGroup'
import { OpenHouseGroup } from './openHouseGroup'
import { ParkingGroup } from './parkingGroup'
import { PoolGroup } from './poolGroup'
import { PropertySubtypesGroup } from './propertySubtypesGroup'
import { SchoolsDistrictsGroup } from './schoolsDistrictsGroup'
import { SquareFootageGroup } from './squareFootageGroup'
import { StatusGroup } from './statusGroup'
import { SubdivisionGroup } from './subdivisionGroup'
import { YearBuiltGroup } from './yearBuiltGroup'

export const OtherEditor = ({
  resultsCount,
  ...otherEditorProps
}: FilterButtonDropDownProp<AlertFilters>) => {
  const classes = useStyles()
  const defaultFilters = otherEditorProps.defaultFilters

  const handleReset = () => {
    otherEditorProps.updateFilters({
      minimum_square_meters: defaultFilters.minimum_square_meters,
      maximum_square_meters: defaultFilters.maximum_square_meters,
      minimum_lot_square_meters: defaultFilters.minimum_lot_square_meters,
      maximum_lot_square_meters: defaultFilters.maximum_lot_square_meters,
      minimum_year_built: defaultFilters.minimum_year_built,
      maximum_year_built: defaultFilters.maximum_year_built,
      pool: defaultFilters.pool,
      property_subtypes: defaultFilters.property_subtypes,
      listing_statuses: defaultFilters.listing_statuses,
      open_house: defaultFilters.open_house,
      architectural_styles: defaultFilters.architectural_styles,
      school_districts: defaultFilters.school_districts,
      junior_high_schools: defaultFilters.junior_high_schools,
      elementary_schools: defaultFilters.elementary_schools,
      high_schools: defaultFilters.high_schools,
      middle_schools: defaultFilters.middle_schools,
      senior_high_schools: defaultFilters.senior_high_schools,
      primary_schools: defaultFilters.primary_schools,
      intermediate_schools: defaultFilters.intermediate_schools,
      minimum_parking_spaces: defaultFilters.minimum_parking_spaces,
      mls_areas: defaultFilters.mls_areas,
      counties: defaultFilters.counties,
      subdivisions: defaultFilters.subdivisions
    })
  }

  return (
    <Grid className={classes.editorRoot}>
      <Grid container alignItems="center" className={classes.header}>
        <TuneIcon />
        <Typography variant="subtitle1" className={classes.title}>
          More Filters
        </Typography>
      </Grid>
      <Grid container direction="column">
        <StatusGroup {...otherEditorProps} />
        <OpenHouseGroup {...otherEditorProps} />
        <PropertySubtypesGroup {...otherEditorProps} />
        <HomeStyleGroup {...otherEditorProps} />
        <MlsAreaGroup {...otherEditorProps} />
        <ParkingGroup {...otherEditorProps} />
        <SubdivisionGroup {...otherEditorProps} />
        <SchoolsDistrictsGroup {...otherEditorProps} />
        <SquareFootageGroup {...otherEditorProps} />
        <LotSizeGroup {...otherEditorProps} />
        <YearBuiltGroup {...otherEditorProps} />
        <PoolGroup {...otherEditorProps} />
      </Grid>
      <FilterEditorFooter
        resultCount={resultsCount}
        onClickReset={handleReset}
      />
    </Grid>
  )
}
