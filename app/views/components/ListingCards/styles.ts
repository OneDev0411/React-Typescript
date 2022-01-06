import { alpha, Theme, makeStyles } from '@material-ui/core'

import { getStatusColor } from 'utils/listing'

import { ListingCardProps } from './ListingCard'

export const useStyles = makeStyles(
  (theme: Theme) => ({
    card: {
      width: '100%',
      marginLeft: theme.spacing(0.5, 0.5, 0, 0),
      '&:hover': {
        borderColor: theme.palette.primary.main,
        boxShadow: `0px 0px 6px 0px ${alpha(theme.palette.primary.main, 0.3)}`
      }
    },
    cardHighlight: {
      borderColor: theme.palette.primary.main,
      boxShadow: `0px 0px 6px 0px ${alpha(theme.palette.primary.main, 0.3)}`
    },
    listingCardMediaWrapper: {
      height: '100%'
    },
    tagsContainer: {
      // We have to absolutely position the tags container because of slider buttons propagation
      position: 'absolute',
      transform: 'translateY(-100%)',
      top: 0,
      left: 0,
      zIndex: 10
    },
    labelChip: {
      backgroundColor: `${alpha(theme.palette.common.black, 0.4)}`,
      border: 'none',
      color: theme.palette.common.white,
      borderRadius: theme.spacing(0, 0.5, 0, 0),
      padding: theme.spacing(0, 0.5),
      height: theme.spacing(3.5)
    },
    cardMediaActionContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '1em',
      height: '1em'
    },
    checkboxRoot: {
      color: `${theme.palette.common.white} !important`,
      filter: `drop-shadow(0px 0.3px 0.5px ${alpha(
        theme.palette.common.black,
        0.1
      )}) drop-shadow(0px 2px 4px ${alpha(theme.palette.common.black, 0.3)})`
    },
    checkboxChecked: {
      color: `${theme.palette.primary.main} !important`,
      filter: `drop-shadow(0px 0.3px 0.5px ${alpha(
        theme.palette.common.black,
        0.1
      )}) drop-shadow(0px 2px 4px ${alpha(theme.palette.common.black, 0.2)})`
    },
    likeButton: {
      borderRadius: '50%',
      padding: theme.spacing(1),
      minWidth: 'auto'
    },
    likeButtonIcon: {
      color: theme.palette.common.white,
      filter: `drop-shadow(0px 0.3px 0.5px ${alpha(
        theme.palette.common.black,
        0.1
      )}) drop-shadow(0px 2px 4px ${alpha(theme.palette.common.black, 0.3)})`
    },
    likeButtonIconLiked: {
      color: theme.palette.primary.main
    },
    cardContent: {
      padding: theme.spacing(1),
      position: 'relative'
    },
    listingFeature: {
      ...theme.typography.subtitle3,
      marginRight: theme.spacing(0.5)
    },
    listingFeatureValue: {
      ...theme.typography.body3
    },
    addressContainer: {
      maxWidth: '100%'
    },
    address: {
      ...theme.typography.body3,
      color: theme.palette.grey[500],
      display: 'flex',
      alignItems: 'center'
    },
    addressIcon: {
      maxWidth: 16,
      maxHeight: 16,
      marginRight: theme.spacing(1)
    },
    selectionContainer: {
      margin: theme.spacing(1.5)
    },
    selectedCheckboxContainer: {
      backgroundColor: theme.palette.common.white
    },
    statusDot: ({ listing }: ListingCardProps) => ({
      backgroundColor: `#${getStatusColor(listing.status)}`,
      width: theme.spacing(1),
      height: theme.spacing(1),
      borderRadius: '50%',
      display: 'inline-block'
    }),
    iconSmall: {
      // TODO: there should be better ways to handling this.
      // https://stackoverflow.com/questions/63880835
      marginLeft: `${theme.spacing(1)}px !important`
    },
    statusChip: {
      backgroundColor: `${alpha(theme.palette.grey[100], 0.8)}`,
      borderRadius: theme.spacing(0.5),
      filter: `drop-shadow(0px 0.3px 0.5px ${alpha(
        theme.palette.common.black,
        0.1
      )}) drop-shadow(0px 2px 4px ${alpha(theme.palette.common.black, 0.2)})`,
      border: 'none'
    },
    statusContainer: {
      margin: theme.spacing(1),
      textAlign: 'center'
    },
    listingFeatureContainer: {
      display: 'flex',
      alignItems: 'center',
      marginRight: theme.spacing(2)
    },
    details: {
      margin: theme.spacing(1, 1, 0)
    },
    detailItem: {
      ...theme.typography.body3,
      display: 'flex',
      alignItems: 'center',
      '&:not(:last-child)': {
        paddingRight: theme.spacing(2),
        borderRight: '1px solid #ccc',
        marginRight: theme.spacing(2)
      }
    },
    detailItemIcon: {
      maxWidth: 16,
      maxHeight: 16,
      marginRight: theme.spacing(1)
    },
    mlsSource: {
      ...theme.typography.body3,
      display: 'flex',
      alignItems: 'center',
      color: theme.palette.grey[700]
    },
    mlsSourceIcon: {
      maxWidth: theme.spacing(2),
      maxHeight: theme.spacing(2),
      marginRight: theme.spacing(0.5)
    }
  }),
  {
    name: 'ListingCard'
  }
)
