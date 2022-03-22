import { Grid, Typography } from '@material-ui/core'
import { mdiTune } from '@mdi/js'
import { isEqual } from 'lodash'

import { getPropertyTypeFirstElement } from '@app/components/Pages/Dashboard/MLS/helpers/get-listings-helpers'
import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { FilterEditorFooter } from '../filterEditorFooter'
import { useStyles } from '../styles'

import { LotSizeGroup } from './lotSizeGroup'
import { OpenHouseGroup } from './openHouseGroup'
import { ParkingGroup } from './parkingGroup'
import { PoolGroup } from './poolGroup'
import { SquareFootageGroup } from './squareFootageGroup'
import { StatusGroup } from './statusGroup'
import { YearBuiltGroup } from './yearBuiltGroup'
import { ZipcodeGroup, ZipCodeGroupProps } from './zipcodeGroup'

export const OtherEditor = ({
  hasMapDrawing,
  resultsCount,
  ...otherEditorProps
}: FilterButtonDropDownProp<AlertFilters> & ZipCodeGroupProps) => {
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
      listing_statuses: defaultFilters.listing_statuses,
      open_house: defaultFilters.open_house,
      minimum_parking_spaces: defaultFilters.minimum_parking_spaces,
      postal_codes: defaultFilters.postal_codes

      // Update filters to unifying them across all MLSs
      // https://gitlab.com/rechat/web/-/issues/5673

      // property_subtypes: defaultFilters.property_subtypes,
      // architectural_styles: defaultFilters.architectural_styles,
      // school_districts: defaultFilters.school_districts,
      // junior_high_schools: defaultFilters.junior_high_schools,
      // elementary_schools: defaultFilters.elementary_schools,
      // high_schools: defaultFilters.high_schools,
      // middle_schools: defaultFilters.middle_schools,
      // senior_high_schools: defaultFilters.senior_high_schools,
      // primary_schools: defaultFilters.primary_schools,
      // intermediate_schools: defaultFilters.intermediate_schools,
      // mls_areas: defaultFilters.mls_areas,
      // counties: defaultFilters.counties,
      // subdivisions: defaultFilters.subdivisions
    })
  }

  const disabledReset = isEqual(filters, defaultFilters)

  return (
    <Grid className={classes.editorRoot}>
      <Grid container alignItems="center" className={classes.header}>
        <SvgIcon path={mdiTune} size={muiIconSizes.medium} />
        <Typography variant="subtitle1" className={classes.title}>
          More Filters
        </Typography>
      </Grid>
      <Grid container direction="column">
        <StatusGroup {...otherEditorProps} />
        <OpenHouseGroup {...otherEditorProps} />

        {!['Multi-Family', 'Lots & Acreage'].includes(
          getPropertyTypeFirstElement(filters) || ''
        ) && <ParkingGroup {...otherEditorProps} />}

        {!['Multi-Family', 'Lots & Acreage'].includes(
          getPropertyTypeFirstElement(filters) || ''
        ) && <SquareFootageGroup {...otherEditorProps} />}

        <LotSizeGroup {...otherEditorProps} />

        {getPropertyTypeFirstElement(filters) !== 'Lots & Acreage' && (
          <YearBuiltGroup {...otherEditorProps} />
        )}

        <ZipcodeGroup hasMapDrawing={hasMapDrawing} {...otherEditorProps} />

        {['Residential', 'Residential Lease'].includes(
          getPropertyTypeFirstElement(filters) || ''
        ) && <PoolGroup {...otherEditorProps} />}
      </Grid>
      <FilterEditorFooter
        resultCount={resultsCount}
        disabledReset={disabledReset}
        onClickReset={handleReset}
      />
    </Grid>
  )
}
