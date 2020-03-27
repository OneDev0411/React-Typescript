import React from 'react'
import { makeStyles, Box } from '@material-ui/core'

import LoadingComponent from '../../../../../../views/components/Spinner'

import ListingCard from '../ListingCard'

const CARDS_CONTAINER_WIDTH = '25em'

// Layout is made with flex. For the big picture, checkout the sample:
// https://codepen.io/mohsentaleb/pen/jOPeVBK
const useStyles = makeStyles(
  theme => ({
    container: {
      flex: '1 1 auto',
      overflow: 'hidden'
    },
    row: {
      display: 'flex',
      height: '100%'
    },
    mapContainer: {
      width: `calc(100% - ${CARDS_CONTAINER_WIDTH})`,
      height: '100%',
      position: 'relative'
    },
    cardsContainer: {
      width: `${CARDS_CONTAINER_WIDTH}`,
      padding: theme.spacing(0, 2, 2),
      overflowY: 'scroll',
      borderLeft: `1px solid ${theme.palette.divider}`
    }
  }),
  { name: 'MapView' }
)

const MapView = props => {
  const classes = useStyles()
  const renderCards = () => {
    if (props.isFetching) {
      return <LoadingComponent />
    }

    return props.sortedListings.map(listing => (
      <ListingCard
        isShowOnMap
        key={listing.id}
        listing={listing}
        tabName={props.tabName}
      />
    ))
  }

  return (
    <Box className={classes.container}>
      <Box className={classes.row}>
        <Box className={classes.mapContainer}>{props.Map}</Box>
        <Box className={classes.cardsContainer}>{renderCards()}</Box>
      </Box>
    </Box>
  )
}

export default MapView

// export const MapView = compose(
//   withState('sortBy', 'changeSortBy', {
//     index: 'price',
//     isDescending: true
//   }),
//   withPropsOnChange(
//     (props, nextProps) =>
//       props.listings.data.length !== nextProps.listings.data.length,
//     ownerProps => ({
//       formatedData: ownerProps.listings.data.map(l =>
//         format(l, ownerProps.mapCenter, ownerProps.user)
//       )
//     })
//   ),
//   withPropsOnChange(
//     (props, nextProps) =>
//       props.formatedData.length !== nextProps.formatedData.length ||
//       props.sortBy.index !== nextProps.sortBy.index ||
//       props.sortBy.isDescending !== nextProps.sortBy.isDescending,
//     ownerProps => ({
//       data: ownerProps.formatedData.sort((a, b) =>
//         sortBy(a, b, ownerProps.sortBy.index, ownerProps.sortBy.isDescending)
//       )
//     })
//   )
// )(MapViewContainer)
