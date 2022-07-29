import { ReactNode } from 'react'

import { makeStyles, Typography } from '@material-ui/core'

import { getStatusColor, metersToFeet } from '@app/utils/listing'

const useStyles = makeStyles(
  theme => ({
    amenity: {
      padding: theme.spacing(1, 2),
      '&:not(last-of-type)': {
        borderBottom: `1px solid ${theme.palette.divider}`
      }
    },
    statusDot: (props: Props) => ({
      backgroundColor: `#${getStatusColor(props.listing.status)}`,
      width: theme.spacing(1),
      height: theme.spacing(1),
      borderRadius: '50%',
      display: 'inline-block'
    }),
    title: {
      fontWeight: theme.typography.fontWeightThin
    },
    value: {
      fontWeight: theme.typography.h1.fontWeight
    }
  }),
  { name: 'ListingAmenityRow' }
)

export function createAmenitiesList(
  listing: IListing,
  classes: ReturnType<typeof useStyles>
): { title: string; value: ReactNode }[] {
  return [
    {
      title: 'Status',
      value: listing.status ? (
        <>
          <div className={classes.statusDot} /> {listing.status}
        </>
      ) : (
        '-'
      )
    },
    { title: 'MLS #', value: listing.mls_number || '-' },
    { title: 'PROPERTY TYPE', value: listing.property.property_type || '-' },
    { title: 'BEDROOMS', value: listing.property.bedroom_count || '-' },
    {
      title: 'BATHROOMS',
      value: listing.property.half_bathroom_count
        ? `${listing.property.full_bathroom_count || 0}.${
            listing.property.half_bathroom_count
          }`
        : listing.property.bathroom_count ||
          listing.property.full_bathroom_count ||
          0
    },
    {
      title: 'BATHROOM DETAILS',
      value: `Full Bath ${
        listing.property.full_bathroom_count ||
        listing.property.bathroom_count ||
        '0'
      }, Half Bath ${listing.property.half_bathroom_count || '0'}`
    },
    {
      title: 'SQFT',
      value: (
        <>
          {`${Math.round(
            metersToFeet(listing.property.square_meters || 0)
          ).toLocaleString()} ft`}
          <sup>2</sup>
        </>
      )
    }
  ]
}

interface Props {
  listing: IListing
}

const ListingAmenityRow = ({ listing }: Props) => {
  const classes = useStyles({ listing })

  const amenitiesList = createAmenitiesList(listing, classes)

  return (
    <>
      {amenitiesList.map((amenity, index) => (
        <div key={index} className={classes.amenity}>
          <Typography className={classes.title} variant="body2">
            {amenity.title}
          </Typography>
          <Typography className={classes.value} variant="subtitle1">
            {amenity.value}
          </Typography>
        </div>
      ))}
    </>
  )
}

export default ListingAmenityRow
