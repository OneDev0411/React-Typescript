import React from 'react'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles, Theme } from '@material-ui/core'

import { getListingFeatures, Feature } from './get-listing-features'

const useStyles = makeStyles(
  (theme: Theme) => ({
    title: {
      [theme.breakpoints.up('md')]: {
        ...theme.typography.h5
      }
    },
    label: {
      ...theme.typography.subtitle3,
      [theme.breakpoints.up('md')]: {
        ...theme.typography.subtitle1
      }
    },
    value: {
      color: theme.palette.grey['800'],
      [theme.breakpoints.up('md')]: {
        ...theme.typography.body1
      }
    }
  }),
  { name: 'FeatureList' }
)

function List({ list }: { list: Feature }) {
  const classes = useStyles()

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Box px={3} mb={3}>
        <Box py={2}>
          <Typography variant="subtitle1" className={classes.title}>
            {list.title}
          </Typography>
        </Box>
        <Box>
          {list.items.map((item, index) => (
            <Typography className={classes.label} key={index}>
              {item.label}:{' '}
              <Typography variant="caption" className={classes.value}>
                {item.value}
              </Typography>
            </Typography>
          ))}
        </Box>
      </Box>
    </Grid>
  )
}

function FeatureLists({ listing }: { listing: IListing }) {
  const lists: Feature[] = getListingFeatures(listing)

  return (
    <Grid container>
      {lists.map((list, index) => (
        <List list={list} key={index} />
      ))}
    </Grid>
  )
}

export default FeatureLists
