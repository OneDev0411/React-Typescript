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
  const filters = otherEditorProps.filters

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

  const disabledReset =
    filters.minimum_square_meters === defaultFilters.minimum_square_meters &&
    filters.maximum_square_meters === defaultFilters.maximum_square_meters &&
    filters.minimum_lot_square_meters ===
      defaultFilters.minimum_lot_square_meters &&
    filters.maximum_lot_square_meters ===
      defaultFilters.maximum_lot_square_meters &&
    filters.minimum_year_built === defaultFilters.minimum_year_built &&
    filters.maximum_year_built === defaultFilters.maximum_year_built &&
    filters.pool === defaultFilters.pool &&
    filters.property_subtypes === defaultFilters.property_subtypes &&
    filters.listing_statuses === defaultFilters.listing_statuses &&
    filters.open_house === defaultFilters.open_house &&
    filters.architectural_styles === defaultFilters.architectural_styles &&
    filters.school_districts === defaultFilters.school_districts &&
    filters.junior_high_schools === defaultFilters.junior_high_schools &&
    filters.elementary_schools === defaultFilters.elementary_schools &&
    filters.high_schools === defaultFilters.high_schools &&
    filters.middle_schools === defaultFilters.middle_schools &&
    filters.senior_high_schools === defaultFilters.senior_high_schools &&
    filters.primary_schools === defaultFilters.primary_schools &&
    filters.intermediate_schools === defaultFilters.intermediate_schools &&
    filters.minimum_parking_spaces === defaultFilters.minimum_parking_spaces &&
    filters.mls_areas === defaultFilters.mls_areas &&
    filters.counties === defaultFilters.counties &&
    filters.subdivisions === defaultFilters.subdivisions

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
        {filters.property_types[0] !== 'Lots & Acreage' && (
          <HomeStyleGroup {...otherEditorProps} />
        )}
        <MlsAreaGroup {...otherEditorProps} />
        <ParkingGroup {...otherEditorProps} />
        <SubdivisionGroup {...otherEditorProps} />
        <SchoolsDistrictsGroup {...otherEditorProps} />

        {!['Multi-Family', 'Lots & Acreage'].includes(
          filters.property_types[0]
        ) && <SquareFootageGroup {...otherEditorProps} />}

        {!['Multi-Family', 'Residential Lease'].includes(
          filters.property_types[0]
        ) && <LotSizeGroup {...otherEditorProps} />}

        {filters.property_types[0] !== 'Lots & Acreage' && (
          <YearBuiltGroup {...otherEditorProps} />
        )}

        {filters.property_types[0] !== 'Lots & Acreage' && (
          <PoolGroup {...otherEditorProps} />
        )}
      </Grid>
      <FilterEditorFooter
        resultCount={resultsCount}
        disabledReset={disabledReset}
        onClickReset={handleReset}
      />
    </Grid>
  )
}
